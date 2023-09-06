import axios from "axios";

export type BeerData = {
  id: number;
  uid: string;
  brand: string;
  name: string;
  style: string;
  hop: string;
  yeast: string;
  malts: string;
  ibu: string;
  alcohol: string;
  blg: string;
};

export type MayBeerData = Partial<BeerData>;

export interface IApiBeerFetcher {
  fetch(): Promise<MayBeerData | Error>;
}

/**
 * @implements {IApiBeerFetcher}
 * @public
 */
export class ApiBeerFetcher implements IApiBeerFetcher {
  /**
   * @returns {Promise<MayBeerData|Error>} ←取得時点でBeerDataと確約できないのでPartialにしました。
   * throws {AxiosError} ←実際の所、元コードではthrowせずstringをreturnしてましたのでthrowsはコメントアウトして、Errorをreturnする形に修正しました。
   * @async
   * @public
   */
  public async fetch(): Promise<MayBeerData | Error> {
    try {
      const randomInt = Math.floor(Math.random() * 2000) + 1;
      const { data } = await axios.get<MayBeerData>(
        "https://random-data-api.com/api/v2/beers",
        {
          timeout: randomInt,
        }
      );
      // return data.name as string;
      return data; //後述の通りas stringだと都合よく型情報をもみ消してしまうのと、fetchがデータの内容を知っている必要は無く、またこの時点でnameプロパティを持っているか確約できない＆fetcherが関知しなくても良いことでもあるので「BeerTypeの可能性のあるdata(MayBeerType)」を作ってdataそのものを返すようにしました。
    } catch (error) {
      console.error(error);
      // asを使うと強制的に型をすり替えるので、TSである旨味がなくなってしまうので、基本処理の中で使うのはなるべく避けたい手です。
      // なので今回の場合、axios.isAsiosError(err)を使って本当にランタイムのデータがその型かどうかを絞り込む方が適切かなと感じました。
      // 例えば今回は.messageプロパティがerrorにも存在するので問題はないですが、強制的に型を書き変えることで、もしAxiosエラーにしかないプロパティをうっかり呼び出していたら、TSでコンパイルエラーにならないけど、ランタイムエラーが発生することになります。
      // 蛇足ですが、TSでは型安全のため、少し前のバージョンから、catch時にはerrorはunknown型になるようになっています。JSではプリミティブでもオブジェクトでも何でもthrowできるからです。
      if (axios.isAxiosError(error)) {
        if (error.message.includes("timeout")) {
          return new Error("ApiBeerFetcher request timed out");
        } else {
          return new Error("ApiBeerFetcher failed to fetch data");
        }
      }

      if (error instanceof Error) {
        return new Error(error.message);
      } else {
        return new Error("unknown error");
      }
    }
  }
}
