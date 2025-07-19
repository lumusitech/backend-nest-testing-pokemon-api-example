import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Pokemon', () => {
    const data = { name: 'pikachu', type: 'electric' };
    const result = service.create(data);

    expect(result).toBe(`This action adds a new pokemon named ${data.name}`);
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
});
