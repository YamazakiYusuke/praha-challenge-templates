import { ApiNameFetcherMock } from "../api/apiNameFetcher";
import { asyncSumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong, sumOfArray } from "../functions";
import { NameApiService } from "../service/nameApiService";
import { FailedDatabaseMock, SuccessfulDatabaseMock } from "../util";

/**
 * sumOfArray
 */
// intのArrayを渡した場合
test('sum of [1, 2, 3, 4] to equal 10', () => {
    // Arrange
    const array: number[] = [1, 2, 3, 4]
    // Act
    const result = sumOfArray(array)
    // Assert
    expect(result).toBe(10);
});
// []を渡した場合
test('sum of [] to equal 0', () => {
    // Arrange
    const array: number[] = []
    // Act
    const data = sumOfArray(array)
    // Assert
    expect(data).toBe(0);
});
// StringのArrayを渡した場合
// test('sum of [] to throw exception', () => {
//     // Arrange
//     const array: String[] = ['A', 'B']
//     // Act, Assert
//     expect(() => sumOfArray([array])).toThrow();
// });

/**
 * asyncSumOfArray
 */
// intのArrayを渡した場合
test('async sum of [1, 2, 3, 4] to equal 10', async () => {
    // Arrange
    const array: number[] = [1, 2, 3, 4]
    // Act
    const data = await asyncSumOfArray(array);
    // Assert
    expect(data).toBe(10);
});
// []を渡した場合
test('async sum of [] to throw exception', async () => {
    // Arrange
    const array: number[] = []
    // Act
    const data = await asyncSumOfArray(array)
    // Assert
    expect(data).toBe(0);
});

/**
 * asyncSumOfArraySometimesZero
 */
// intのArrayを渡した場合 && Database保存成功
test('async sum of same times zero of [1, 2, 3, 4] and data save success to equal 10', async () => {
    // Arrange
    const array = [1, 2, 3, 4];
    const database = new SuccessfulDatabaseMock();
    // Act
    const data = await asyncSumOfArraySometimesZero(array, database);
    // Assert
    expect(data).toBe(10);
});
// []を渡した場合 && Database保存成功
test('async sum of same times zero of [] and data save success to be 0', async () => {
    // Arrange
    const array: number[] = [];
    const database = new SuccessfulDatabaseMock();
    // Act
    const data = await asyncSumOfArraySometimesZero(array, database);
    // Assert
    expect(data).toBe(0);
});
// intのArrayを渡した場合 && Database保存失敗
test('async sum of same times zero of [1, 2, 3, 4] and data save failed to equal 0', async () => {
    // Arrange
    const array = [1, 2, 3, 4];
    const database = new FailedDatabaseMock();
    // Act
    const data = await asyncSumOfArraySometimesZero(array, database);
    // Assert
    expect(data).toBe(0);
});
// []を渡した場合 && Database保存失敗
test('async sum of same times zero of [] and data save failed to be 0', async () => {
    const array: number[] = [];
    const database = new FailedDatabaseMock();
    // Act
    const data = await asyncSumOfArraySometimesZero(array, database);
    // Assert
    expect(data).toBe(0);
});

/**
 * getFirstNameThrowIfLong
 */
// maxNameLengthが4文字 && firstNameが4文字の場合
test('async sum of same times zero of [1, 2, 3, 4] and data save success to equal 10', async () => {
    // Arrange
    const firstName = 'abcd';
    const apiNameFetcher = new ApiNameFetcherMock(firstName);
    const nameApiService = new NameApiService(apiNameFetcher);
    const maxNameLength = 4;
    // Act
    const data = await getFirstNameThrowIfLong(maxNameLength, nameApiService);
    // Assert
    expect(data).toBe(firstName);
});
// maxNameLengthが5文字 && firstNameが5文字の場合
test('async sum of [] to throw exception', async () => {
    // Arrange
    const firstName = 'abcde';
    const apiNameFetcher = new ApiNameFetcherMock(firstName);
    const nameApiService = new NameApiService(apiNameFetcher);
    const maxNameLength = 5;
    // Act, Assert
    expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).rejects.toThrow('firstName is too long!');
});
// maxNameLengthが2文字 && firstNameが3文字の場合
test('async sum of [] to throw exception', async () => {
    // Arrange
    const firstName = 'abc';
    const apiNameFetcher = new ApiNameFetcherMock(firstName);
    const nameApiService = new NameApiService(apiNameFetcher);
    const maxNameLength = 2;
    // Act, Assert
    expect(getFirstNameThrowIfLong(maxNameLength, nameApiService)).rejects.toThrow('first_name too long');
});