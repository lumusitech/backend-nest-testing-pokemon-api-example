import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('should validate with default values', async () => {
    const dto = new PaginationDto();

    const errors = await validate(dto);
    // console.log({ errors }); //? use this for details about errors

    expect(errors.length).toBe(0);
  });

  it('should validate with valid values', async () => {
    const dto = new PaginationDto();

    dto.limit = 15;
    dto.page = 7;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate with invalid page', async () => {
    const dto = new PaginationDto();

    dto.page = -1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'page') {
        expect(error.constraints?.min).toBeDefined();
        expect(error.constraints?.min).toBe('page must not be less than 1');
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should not validate with invalid limit', async () => {
    const dto = new PaginationDto();

    dto.limit = -1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'limit') {
        expect(error.constraints?.min).toBeDefined();
        expect(error.constraints?.min).toBe('limit must not be less than 1');
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should convert string value to number', async () => {
    const input = {
      limit: '10',
      page: '10',
    };

    //? use before validate, because we need run transformation first
    const dto = plainToInstance(PaginationDto, input);
    expect(dto).toEqual({ limit: 10, page: 10 });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
