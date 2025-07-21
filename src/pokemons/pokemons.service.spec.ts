import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonsService } from './pokemons.service';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const data = { name: 'pikachu', type: 'electric' };
    const result = await service.create(data);

    expect(result).toEqual(expect.objectContaining(data));
    expect(result).toEqual({
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      hp: 0,
      sprites: [],
    });
  });

  it('should try create an existing pokemon and throw a BadRequestException', async () => {
    const data = { name: 'pikachu', type: 'electric' };
    await service.create(data); //? first creation is successful

    await expect(service.create(data)).rejects.toThrow(BadRequestException);
    await expect(service.create(data)).rejects.toThrow(
      `${data.name} already exists`,
    );
  });

  it('should update a pokemon', async () => {
    const dto: UpdatePokemonDto = { name: 'someNewName' };
    const id = 1;

    const updatedPokemon = await service.update(id, dto);

    expect(updatedPokemon).toEqual(expect.objectContaining(dto));
    expect(updatedPokemon).toEqual({
      hp: 45,
      id: 1,
      name: dto.name,
      sprites: [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
      ],
      type: 'grass',
    });
  });

  it('should try update a pokemon, but throw a NotFoundException', async () => {
    const dto: UpdatePokemonDto = { name: 'someNewName' };
    const id = 1_000_000;

    await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
    await expect(service.update(id, dto)).rejects.toThrow(
      `Pokemon with id ${id} not found`,
    );
  });

  it('should return a pokemon if exists', async () => {
    const id = 1;

    const result = await service.findOne(id);

    expect(result).toBeDefined();
    expect(result).toEqual({
      id: 1,
      name: 'bulbasaur',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
      type: 'grass',
    });
  });

  it('should return a pokemon if exists from cache', async () => {
    const id = 1;
    const cacheState = service.pokemonCache;
    expect(cacheState.size).toBe(0); //? empty cache first time

    await service.findOne(id); //? set item to cache
    expect(cacheState.size).toBe(1);

    await service.findOne(id); //? second time return from cache
    expect(cacheState.size).toBe(1);
  });

  it('should return a pokemon if exists from cache - option 2 - BETTER', async () => {
    const id = 1;
    const cacheSpy = jest.spyOn(service.pokemonCache, 'get');
    const fetchSpy = jest.spyOn(global, 'fetch');

    await service.findOne(id);
    await service.findOne(id);

    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith(id);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should check pokemon props', async () => {
    const id = 1;

    const result = await service.findOne(id);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    //? When object has a lot of props, is better:
    expect(result).toEqual(
      expect.objectContaining({
        id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hp: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sprites: expect.any(Array),
      }),
    );
  });

  it('should return a 404 error if pokemon not exists', async () => {
    const id = 400000; //? invalid id

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(
      `Pokemon with id ${id} not found`,
    );
  });

  //! WARNING: should not pass with invalid message
  it('WARNING: should return a 404 error if pokemon not exists', async () => {
    const id = 400000; //? invalid id

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(`f`); //! ??? invalid message ???
  });

  it('should return pokemons and cache data', async () => {
    const query = { limit: 10, page: 2 };

    const response = await service.findAll(query);

    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(query.limit);
    expect(service.paginatedPokemonsCache.has(`${query.page}-${query.limit}`));
    expect(
      service.paginatedPokemonsCache.get(`${query.page}-${query.limit}`)
        ?.length,
    ).toBe(query.limit);
    expect(
      service.paginatedPokemonsCache.get(`${query.page}-${query.limit}`),
    ).toEqual(response);
  });

  it('should return pokemons from cache data', async () => {
    const query = { limit: 10, page: 2 };

    const initialCacheState = service.paginatedPokemonsCache;
    expect(initialCacheState.size).toBe(0); //?  without cache first query

    await service.findAll(query);
    expect(initialCacheState.size).toBe(1); //? with cached item second query
    expect(initialCacheState.has(`${query.page}-${query.limit}`)).toBeTruthy();

    await service.findAll(query);
    expect(initialCacheState.has(`${query.page}-${query.limit}`)).toBeTruthy(); //? return cached item
  });

  it('should return pokemons from cache data - option 2 - BETTER', async () => {
    const query = { limit: 10, page: 2 };
    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get');
    const fetchSpy = jest.spyOn(global, 'fetch');

    await service.findAll(query); //? first time use fetch
    await service.findAll(query); //? then, use cached data

    expect(cacheSpy).toHaveBeenCalled();
    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith(`${query.page}-${query.limit}`);
    expect(fetchSpy).toHaveBeenCalledTimes(query.limit + 1); //? only, called once, after get given limit pokemons
  });

  it('should remove a existing pokemon with a valid id', async () => {
    const id = 1;
    await service.findOne(id);
    expect(service.pokemonCache.size).toBe(1);

    await service.remove(id);
    expect(service.pokemonCache.size).toBe(0);
    expect(service.pokemonCache.get(id)).toBeUndefined();
  });
});
