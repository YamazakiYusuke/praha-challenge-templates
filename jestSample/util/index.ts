const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export interface IDatabase {
  save(numbers: number[]): void;
}

export class Database implements IDatabase {
  public save(_: number[]): void {
    // memo: 課題のために、あえて時々saveが失敗するようにしている
    if (getRandomInt(10) < 2) {
      throw new Error("fail!");
    }
  }
}
/**
 * Databaseの成功パターンMock
 */
export class SuccessfulDatabaseMock implements IDatabase {
  public save(_: number[]): void {
  }
}
/**
 * Databaseの失敗パターンMock
 */
export class FailedDatabaseMock implements IDatabase {
  public save(_: number[]): void {
    throw new Error("fail!");
  }
}
