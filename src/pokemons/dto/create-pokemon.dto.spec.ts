import { validate } from 'class-validator';
import 'reflect-metadata';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('CreatePokemonDto', () => {
  it('should validate with valid data, only with required props', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = 'grass';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate all valid properties', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = 'grass';
    //? optional props
    dto.hp = 1;
    dto.sprites = ['sprite1.jpg', 'sprite2.jpg'];

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate empty string name', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = '';
    dto.type = 'grass';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'name') {
        expect(error.constraints?.isNotEmpty).toBeDefined();
        expect(error.constraints?.isNotEmpty).toBe('name should not be empty');
      }
    });
  });

  it('should not validate empty string name - option 2 with find', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = '';
    dto.type = 'grass';

    const errors = await validate(dto);

    const nameError = errors.find((error) => error.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should not validate empty string type', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = '';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'type') {
        expect(error.constraints?.isNotEmpty).toBeDefined();
        expect(error.constraints?.isNotEmpty).toBe('type should not be empty');
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should not validate empty string type - option 2 with find', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = '';

    const errors = await validate(dto);

    const typeError = errors.find((error) => error.property === 'type');
    expect(typeError).toBeDefined();
  });

  it('should not validate hp lower than 1', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = 'grass';
    //? optional prop
    dto.hp = -1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'hp') {
        expect(error.constraints?.min).toBeDefined();
        expect(error.constraints?.min).toBe('hp must not be less than 1');
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should not validate hp lower than 1 - option 2 with find', async () => {
    const dto = new CreatePokemonDto();

    //? required props
    dto.name = 'pika';
    dto.type = 'grass';
    //? optional prop
    dto.hp = -1;

    const errors = await validate(dto);

    const hpError = errors.find((error) => error.property === 'hp');
    expect(hpError).toBeDefined();
    expect(hpError?.constraints).toEqual({ min: 'hp must not be less than 1' });
    expect(hpError?.constraints?.min).toBe('hp must not be less than 1');
  });

  it('should not validate sprites array with numbers', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'pika';
    dto.type = 'grass';
    dto.sprites = [1, -2] as unknown as string[];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property === 'sprites');
    expect(spritesError).toBeDefined();
    expect(spritesError?.constraints?.isString).toBe(
      'each value in sprites must be a string',
    );
    expect(spritesError?.constraints).toEqual({
      isString: 'each value in sprites must be a string',
    });
  });

  it('should validate sprites array with string values', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'pika';
    dto.type = 'grass';
    dto.sprites = ['sprite1.jpg', 'sprite2.jpg'];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property === 'sprites');
    // expect(spritesError).not.toBeDefined(); //! Not recommended
    expect(spritesError).toBeUndefined();
  });
});
