import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';

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
    const response = await request(app.getHttpServer())
      .post('/pokemons')
      .send({ name: 'pikachu', type: 'electric' });

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
});
