import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  it('should add two numbers', () => {
    // Arrange
    const num1 = 1;
    const num2 = 7;

    // Act
    const result = sum(num1, num2);

    //Assert
    expect(result).toBe(num1 + num2);
  });
});
