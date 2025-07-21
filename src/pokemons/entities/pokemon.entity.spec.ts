// export class Pokemon {
//   id: number;
//   name: string;
//   type: string;
//   hp: number;
//   sprites: string[];
// }

import { Pokemon } from './pokemon.entity';

describe('Pokemon Entity', () => {
  it('should create an instance of Pokemon entity', () => {
    const pokemon = new Pokemon();

    expect(pokemon).toBeInstanceOf(Pokemon);
  });

  it('should have all props', () => {
    const pokemon = new Pokemon();
    pokemon.id = 1;
    pokemon.name = 'anyName';
    pokemon.type = 'anyType';
    pokemon.hp = 0;
    pokemon.sprites = [];

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toHaveProperty('type');
    //? when object has too much props, is better:
    expect(pokemon).toEqual(
      expect.objectContaining({
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
      }),
    );

    //? in some cases, we can test the serialized object
    expect(JSON.stringify(pokemon)).toBe(
      '{"id":1,"name":"anyName","type":"anyType","hp":0,"sprites":[]}',
    );
  });
});
