import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonAPI } from './interfaces/pokeapi-pokemon.response';
import { PokeAPIResponse } from './interfaces/pokeapi.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonsCache = new Map<string, Pokemon[]>();
  pokemonCache = new Map<number, Pokemon>();

  async create(createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = {
      ...createPokemonDto,
      id: new Date().getTime(),
      hp: createPokemonDto.hp ?? 0,
      sprites: createPokemonDto.sprites ?? [],
    };

    const exists = Array.from(this.pokemonCache.values()).some(
      (storedPokemon) => storedPokemon.name === pokemon.name,
    );

    if (exists) {
      throw new BadRequestException(`${pokemon.name} already exists`);
    }

    this.pokemonCache.set(pokemon.id, pokemon);

    return Promise.resolve(pokemon);
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const cacheKey = `${page}-${limit}`;
    if (this.paginatedPokemonsCache.has(cacheKey)) {
      return this.paginatedPokemonsCache.get(cacheKey) || [];
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokeAPIResponse;

    const pokemonPromises = data.results.map((result) => {
      return this.getPokemonInformation(+result.url.split('/').at(-2)!);
    });

    const pokemons = await Promise.all(pokemonPromises);

    this.paginatedPokemonsCache.set(cacheKey, pokemons);

    return pokemons;
  }

  async findOne(id: number) {
    if (this.pokemonCache.has(id)) {
      return this.pokemonCache.get(id);
    }
    const pokemon = await this.getPokemonInformation(id);

    this.pokemonCache.set(id, pokemon);
    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    const updatedPokemon = {
      ...pokemon!,
      ...updatePokemonDto,
    };

    this.pokemonCache.set(pokemon!.id, updatedPokemon);

    return updatedPokemon;
  }

  async remove(id: number) {
    const pokemon = await this.findOne(id);

    this.pokemonCache.delete(pokemon!.id);

    return `pokemon with id ${pokemon!.name} removed`;
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);

    if (response.status === 404)
      throw new NotFoundException(`Pokemon with id ${id} not found`);

    const data = (await response.json()) as PokemonAPI;

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
      type: data.types[0].type.name,
    };

    return pokemon;
  }
}
