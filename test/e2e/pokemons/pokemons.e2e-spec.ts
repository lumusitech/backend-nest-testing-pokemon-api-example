import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePokemonDto } from 'src/pokemons/dto/create-pokemon.dto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { Pokemon } from '../../../src/pokemons/entities/pokemon.entity';

describe('PokemonsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('/pokemons (POST) - without body - option 1 like Nest', () => {
    return request(app.getHttpServer())
      .post('/pokemons')
      .expect(400)
      .expect({
        message: [
          'name should not be empty',
          'name must be a string',
          'type should not be empty',
          'type must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  //? BETTER:
  it('/pokemons (POST) - without body - option 2 Better', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messageArray: string[] = response.body.message ?? [];

    expect(response.status).toBe(400);

    expect(messageArray).toContain('name should not be empty');
    expect(messageArray).toContain('name must be a string');
    expect(messageArray).toContain('type should not be empty');
    expect(messageArray).toContain('type must be a string');
  });

  //? Other way
  it('/pokemons (POST) - without body - option 2 Better', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');
    const mustHaveErrorMessages = [
      'name should not be empty',
      'name must be a string',
      'type should not be empty',
      'type must be a string',
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messageArray: string[] = response.body.message ?? [];

    expect(mustHaveErrorMessages.length).toBe(messageArray.length);
    expect(messageArray).toEqual(expect.arrayContaining(mustHaveErrorMessages));
  });

  it('/pokemons (POST) - with valid body', async () => {
    const command: CreatePokemonDto = { name: 'pikachu', type: 'electric' };
    const response = await request(app.getHttpServer())
      .post('/pokemons')
      .send(command);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      name: 'pikachu',
      type: 'electric',
      hp: 0,
      sprites: [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
    });
  });

  it('/pokemons (POST) should return an error when pokemon already exists', async () => {
    const command: CreatePokemonDto = { name: 'newName', type: 'newType' };

    const response1 = await request(app.getHttpServer())
      .post('/pokemons')
      .send(command);

    expect(response1.status).toBe(201);

    const response2 = await request(app.getHttpServer())
      .post('/pokemons')
      .send(command);

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      message: 'newName already exists',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/pokemons (GET) - with given invalid limit', async () => {
    const invalidLimit = -10;
    const response = await request(app.getHttpServer())
      .get(`/pokemons`)
      .query({ limit: invalidLimit });

    expect(response.status).toBe(400);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.error).toBe('Bad Request');
  });

  it('/pokemons (GET) - with given limit', async () => {
    const limit = 10;
    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query({ limit });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(limit);

    //? Option 1
    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('sprites');
    });

    //? Option 2
    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toEqual({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hp: expect.any(Number),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sprites: expect.any(Array),
      });
    });
  });

  it('/pokemons (GET) - from cache', async () => {
    const limit = 10;

    const initialTime1 = performance.now();
    await request(app.getHttpServer()).get('/pokemons').query({ limit });
    const finalTime1 = performance.now();
    const costInTime1 = finalTime1 - initialTime1;

    const initialTime2 = performance.now();
    await request(app.getHttpServer()).get('/pokemons').query({ limit });
    const finalTime2 = performance.now();
    const costInTime2 = finalTime2 - initialTime2;

    expect(costInTime2).toBeLessThan(costInTime1);
  });

  it('/pokemons/:id (GET) should return a Pokemon by id', async () => {
    const id = 1;
    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);
    const pokemon = response.body as Pokemon;

    expect(response.status).toBe(200);
    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toHaveProperty('type');
    expect(pokemon).toHaveProperty('hp');
    expect(pokemon).toHaveProperty('sprites');

    expect(pokemon).toEqual({
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

  it('/pokemons/:id (GET) should return a Pokemon by id', async () => {
    const id = 9999999;
    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);

    expect(response.status).toBe(404);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBe(`Pokemon with id ${id} not found`);
    //? Or maybe better
    expect(response.body).toEqual({
      error: 'Not Found',
      message: `Pokemon with id ${id} not found`,
      statusCode: 404,
    });
  });

  it('/pokemons/:id (PATCH) should update a pokemon', async () => {
    const id = 1;
    const command = { name: 'updatedName' };
    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${id}`)
      .send(command);

    const updatedPokemon = response.body as Pokemon;

    expect(response.status).toBe(200);
    expect(updatedPokemon.name).toBe(command.name);
  });

  //? Option 2
  it('/pokemons/:id (PATCH) should update a pokemon - option 2', async () => {
    const id = 1;
    const command = { name: 'updatedName' };

    //? get a pristine pokemon
    const getPokemonResponse = await request(app.getHttpServer()).get(
      `/pokemons/${id}`,
    );
    const pristinePokemon = getPokemonResponse.body as Pokemon;

    //? update the pokemon
    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${id}`)
      .send(command);
    const updatedPokemon = response.body as Pokemon;

    expect(response.status).toBe(200);
    expect(updatedPokemon.name).toBe(command.name); //? the unique prop that must to be updated
    expect(updatedPokemon.id).toBe(pristinePokemon.id);
    expect(updatedPokemon.type).toBe(pristinePokemon.type);
    expect(updatedPokemon.hp).toBe(pristinePokemon.hp);
    expect(updatedPokemon.sprites).toEqual(pristinePokemon.sprites);
  });

  it('/pokemons/:id (PATCH) should update a pokemon, but invalid id', async () => {
    const invalidId = 1_000_000;
    const response = await request(app.getHttpServer()).patch(
      `/pokemons/${invalidId}`,
    );

    expect(response.status).toBe(404);
    //? you can test specific body, but it is unnecessary because it was tested with unit testing
    expect(response.body).toEqual({
      message: `Pokemon with id ${invalidId} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/pokemons/:id (DELETE) should return a removed pokemon id', async () => {
    const id = 1;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${id}`,
    );

    expect(response.status).toBe(200);
    expect(response.text).toBe(`pokemon with id ${id} removed`);
  });

  it('/pokemons/:id (DELETE) should return an error with invalid pokemon id', async () => {
    const invalidId = 1_000_000;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${invalidId}`,
    );

    expect(response.status).toBe(404);
    //? If you want more specific test
    expect(response.body).toEqual({
      message: `Pokemon with id ${invalidId} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });
});
