import { NameApiService } from "./service/nameApiService";
import { IDatabase } from "./util";

export const sumOfArray = (numbers: number[]): number => {
  if (numbers.length == 0) {
    console.log("Argument array is empty!");
    return 0;
  }
  return numbers.reduce((a: number, b: number): number => a + b);
};

export const asyncSumOfArray = (numbers: number[]): Promise<number> => {
  return new Promise((resolve): void => {
    resolve(sumOfArray(numbers));
  });
};

export const asyncSumOfArraySometimesZero = (
  numbers: number[],
  database: IDatabase
): Promise<number> => {
  return new Promise((resolve): void => {
    try {
      database.save(numbers);
      resolve(sumOfArray(numbers));
    } catch (error) {
      resolve(0);
    }
  });
};

export const getFirstNameThrowIfLong = async (
  maxNameLength: number,
  nameApiService: NameApiService
): Promise<string> => {
  const firstName = await nameApiService.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};
