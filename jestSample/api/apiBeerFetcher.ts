import axios, { AxiosError } from "axios";

export interface IApiBeerFetcher {
  fetch(): Promise<string>;
}

/**
 * `ApiBeerFetcher`クラスはビールデータを非同期に取得します。
 * `IApiBeerFetcher` インターフェースを実装しています。
 *
 * @remarks
 * このクラスは`axios`を用いて"https://random-data-api.com/api/v2/beers"からデータをフェッチします。
 * リクエストのタイムアウトは1から2000ミリ秒のランダムな値です。
 *
 * @example
 * ```ts
 * const fetcher = new ApiBeerFetcher();
 * const beerData = await fetcher.fetch();
 * console.log(beerData);
 * ```
 *
 * @implements {IApiBeerFetcher}
 * @public
 */
export class ApiBeerFetcher implements IApiBeerFetcher {

  /**
   * ランダムなビールデータを非同期に取得します。
   * レスポンス中のビール名を文字列として返します。
   * リクエストがタイムアウトした場合やデータ取得に失敗した場合は、適切なエラーメッセージを返します。
   * 
   * @returns {Promise<string>} フェッチしたビールデータの名前またはエラーメッセージ。
   * @throws {AxiosError} リクエストのエラー情報。
   * @async
   * @public
   */
  public async fetch(): Promise<string> {
    try {
      const randomInt = Math.floor(Math.random() * 2000) + 1;
      const { data } = await axios.get(
        "https://random-data-api.com/api/v2/beers", { timeout: randomInt }
      );
      console.log(data);
      return data.name as string;
    } catch (error) {
      console.error(error);
      if ((error as AxiosError).message.includes('timeout')) {
        return 'ApiBeerFetcher request timed out';
      } else {
        return 'ApiBeerFetcher failed to fetch data';
      }
    }
  }
}

export class SuccessfulApiBeerFetcherMock implements IApiBeerFetcher {
  private beerName: string;

  public constructor(beerName: string) {
    this.beerName = beerName;
  }

  public async fetch(): Promise<string> {
    return this.beerName;
  }
}

export class TimedOutApiBeerFetcherMock implements IApiBeerFetcher {
  public async fetch(): Promise<string> {
    return 'ApiBeerFetcher request timed out';
  }
}

export class FailedApiBeerFetcherMock implements IApiBeerFetcher {
  public async fetch(): Promise<string> {
    return 'ApiBeerFetcher failed to fetch data';
  }
}