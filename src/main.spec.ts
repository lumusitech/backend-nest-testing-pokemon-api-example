import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe('Main - Bootstrap', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock;
    setGlobalPrefix: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should create the application', async () => {
    await bootstrap();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should have set global prefix', async () => {
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('should listen on fallback port', async () => {
    const PORT = 3000;
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(PORT);
  });

  it('should listen on env port', async () => {
    process.env.PORT = '4200';
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT);
  });

  it('should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        validatorOptions: expect.objectContaining({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      }),
    );
  });
});
