import { Test, TestingModule } from '@nestjs/testing';

import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';

const MOCK_POKEMONS = [
  {
    id: 1,
    name: 'bulbasaur',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
    type: 'grass',
  },
  {
    id: 2,
    name: 'ivysaur',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
    type: 'grass',
  },
  {
    id: 3,
    name: 'venusaur',
    hp: 80,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png',
    ],
    type: 'grass',
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be call service with dto', async () => {
    const query = { limit: 2, page: 1 };

    jest.spyOn(service, 'findAll');

    await controller.findAll(query);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should be call service with dto and return a valid response', async () => {
    const query = { limit: 2, page: 1 };

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(MOCK_POKEMONS));

    const response = await controller.findAll(query);

    expect(response).toEqual(MOCK_POKEMONS);
    expect(response.length).toBe(MOCK_POKEMONS.length);
  });

  it('should have called the service with the correct id(findOne)', async () => {
    const pokemon = MOCK_POKEMONS[0];

    jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(pokemon));

    const response = await controller.findOne(`${pokemon.id}`);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findOne).toHaveBeenCalledWith(pokemon.id);
    expect(response).toEqual(pokemon);
  });

  it('should have called the service with the correct id and data(update)', async () => {
    const dto = {};
    const id = '1';
    jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve('Some response'));

    const response = await controller.update(id, dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalledWith(+id, dto);
    expect(response).toEqual('Some response');
  });

  it('should have called the service with the correct id(delete)', async () => {
    const id = '1';
    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve('some response'));

    const response = await controller.remove(id);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.remove).toHaveBeenCalledWith(+id);
    expect(response).toEqual('some response');
  });
});
