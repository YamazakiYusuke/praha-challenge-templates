import { FailedApiBeerFetcherMock, SuccessfulApiBeerFetcherMock, TimedOutApiBeerFetcherMock } from "../api/apiBeerFetcher";
import { calculateAge, getBeerNameExceptIPA, splitAndInvoke } from "../assignment4";

describe('calculateAge', () => {
  it('age should be 20', () => {
    // Arrange
    const now = new Date();
    const twentyYearsAgo = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate());
    // Act
    const age = calculateAge(twentyYearsAgo);
    // Assert
    expect(age).toBe(20);
  });

  it('age should be 19(1 month before birthday)', () => {
    // Arrange
    const now = new Date();
    const twentyYearsAgo = new Date(now.getFullYear() - 20, now.getMonth() + 1, now.getDate());
    // Act
    const age = calculateAge(twentyYearsAgo);
    // Assert
    expect(age).toBe(19);
  });

  it('age should be 19(1 day before birthday)', () => {
    // Arrange
    const now = new Date();
    const twentyYearsAgo = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate() + 1);
    // Act
    const age = calculateAge(twentyYearsAgo);
    // Assert
    expect(age).toBe(19);
  });
});

describe('getBeerNameExceptIPA', () => {
  it('API get not IPA beer to equal beer name', async () => {
    // Arrange
    const beerName = 'Corona Extra'
    const mockApi = new SuccessfulApiBeerFetcherMock(beerName);
    // Act
    const result = await getBeerNameExceptIPA(mockApi);
    // Assert
    expect(result).toBe(beerName);
  });

  it('API get IPA beer to equal empty string', async () => {
    // Arrange
    const beerName = 'Lagunitas IPA'
    const mockApi = new SuccessfulApiBeerFetcherMock(beerName);
    // Act
    const result = await getBeerNameExceptIPA(mockApi);
    // Assert
    expect(result).toBe('');
  });

  it('API time out to equal specified error message', async () => {
    // Arrange
    const mockApi = new TimedOutApiBeerFetcherMock();
    // Act
    const result = await getBeerNameExceptIPA(mockApi);
    // Assert
    expect(result).toBe('ApiBeerFetcher request timed out');
  });

  it('API failed to equal specified error message', async () => {
    // Arrange
    const mockApi = new FailedApiBeerFetcherMock();
    // Act
    const result = await getBeerNameExceptIPA(mockApi);
    // Assert
    expect(result).toBe('ApiBeerFetcher failed to fetch data');
  });
});

describe("splitAndInvoke", () => {
  it("split words and invoke these by the specified delay", async () => {
    // Arrange
    const mockFn = jest.fn();
    const text = "Hello world";
    const delay = 500;
    // Act
    const promise = splitAndInvoke(text, mockFn, delay);
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("Hello");
    await promise;
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith("world");
  });
});