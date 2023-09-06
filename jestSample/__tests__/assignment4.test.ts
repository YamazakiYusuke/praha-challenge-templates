import { MayBeerData } from "../api/apiBeerFetcher";
import {
  calculateAge,
  getBeerNameExceptIPA,
  splitAndInvoke,
} from "../assignment4";

describe("calculateAgeのテスト", () => {
  test("1982/1/1生まれの人は2023/1/1に41歳", () => {
    const birthday = new Date(1982, 0, 1);
    const now = new Date(2023, 0, 1); // 2023/1/1
    expect(calculateAge(birthday, now)).toBe(41);
  });
  test("1988/8/15生まれの人は2024/7/31には35歳", () => {
    const birthday = new Date(1988, 7, 15);
    const now = new Date(2024, 6, 31);
    expect(calculateAge(birthday, now)).toBe(35);
  });
  test("2012/11/11生まれの人は2023/11/1には10歳", () => {
    const birthday = new Date(2012, 10, 11);
    const now = new Date(2023, 10, 1);
    expect(calculateAge(birthday, now)).toBe(10);
  });
  test("間違えて未来を誕生日として入れた場合", () => {
    const birthday = new Date(2030, 0, 1);
    const now = new Date(2022, 0, 1);
    expect(() => calculateAge(birthday, now)).toThrow(
      "誕生日を未来に設定することは出来ません。"
    );
  });
});

describe("getBeerNameExceptIPAのテスト", () => {
  test("正常にデータが取得でき、IPAのデータが取得され為nullになる", async () => {
    const mockDataHasIPA = {
      id: 6384,
      uid: "89adec9f-f167-4535-af6a-2f6d4c8a3da9",
      brand: "Harp",
      name: "90 Minute IPA",
      style: "Amber Hybrid Beer",
      hop: "Cluster",
      yeast: "1084 - Irish Ale",
      malts: "Carapils",
      ibu: "61 IBU",
      alcohol: "6.8%",
      blg: "16.7°Blg",
    };

    const successFetcherHasIPA = {
      fetch: () => {
        return new Promise<typeof mockDataHasIPA>((resolve) => {
          resolve(mockDataHasIPA);
        });
      },
    };
    await expect(
      getBeerNameExceptIPA(successFetcherHasIPA)
    ).resolves.toBeNull();
  });

  test("正常にデータが取得でき、IPAと入ってないデータが取得された", async () => {
    const mockDataNotIPA = {
      id: 512,
      uid: "ce1f5252-27f0-45f2-be08-9d9cd9886615",
      brand: "Pabst Blue Ribbon",
      name: "Trappistes Rochefort 8",
      style: "English Brown Ale",
      hop: "Chinook",
      yeast: "1099 - Whitbread Ale",
      malts: "Black malt",
      ibu: "32 IBU",
      alcohol: "2.7%",
      blg: "12.7°Blg",
    };
    const successFetcherNotIPA = {
      fetch: () => {
        return new Promise<typeof mockDataNotIPA>((resolve) => {
          resolve(mockDataNotIPA);
        });
      },
    };

    await expect(
      getBeerNameExceptIPA(successFetcherNotIPA)
    ).resolves.not.toMatch(/IPA/);
  });

  test("正常にデータが取得できたが、想定してないデータが取得された", async () => {
    const mockDataSomethingWrong = {
      warn: "request not correnct",
    };
    const successFetcherSomethingWrong = {
      fetch: () => {
        return new Promise<MayBeerData>((resolve) => {
          resolve(mockDataSomethingWrong as MayBeerData);
        });
      },
    };
    const wrongData = getBeerNameExceptIPA(successFetcherSomethingWrong);
    await expect(wrongData).resolves.toBeUndefined();
  });

  test("fetcherでエラーが返却された", async () => {
    const failureFetcher = {
      fetch: () => {
        return new Promise<Error>((resolve) => {
          resolve(new Error());
        });
      },
    };
    await expect(getBeerNameExceptIPA(failureFetcher)).resolves.toBeUndefined();
  });
});

describe("splitAndInvokeのCallback機能テスト", () => {
  const mockCallback = jest.fn((word) => word);
  const text = "wareware wa utyujin dearu";

  test("textの分割が「wareware wa utyujin dearu」の時4", async () => {
    await splitAndInvoke(text, mockCallback, 1); //タイマーはこのセクションでは検証しない為1mm秒に設定してみた
    expect(mockCallback.mock.calls).toHaveLength(4);
  });

  test("「wareware wa utyujin dearu」を分割した時最初がwareware、3番目がutyujin", async () => {
    await splitAndInvoke(text, mockCallback, 1);
    expect(mockCallback.mock.calls[0][0]).toBe("wareware");
    expect(mockCallback.mock.calls[2][0]).toBe("utyujin");
  });
});

describe("splitAndInvokeのTimerテスト", () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("タイマーのテスト", async () => {
    const text = "Hello world";
    const promise = splitAndInvoke(text, mockCallback, 100); // delayを100ms

    jest.advanceTimersByTime(100); // 最初のワードのためにタイマーを100ms進める
    await Promise.resolve(); // JavaScriptのイベントループを一回進める
    expect(mockCallback).toHaveBeenNthCalledWith(1, "Hello");

    jest.advanceTimersByTime(100);
    await Promise.resolve();
    expect(mockCallback).toHaveBeenNthCalledWith(2, "world");

    await promise; // splitAndInvoke関数が完了するまで待つ
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
