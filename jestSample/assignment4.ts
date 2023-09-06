import { IApiBeerFetcher } from "./api/apiBeerFetcher";

/**
 * @remarks
 * やっぱ日付扱いますよねー。
 * mock化できるように引数で取る形にしました。
 * @param {Date} birthday - 計算の基となる誕生日。
 * @param {Date} [now = new Date()] - 現在日時
 * @returns {number} 計算された年齢。
 * @throws {"誕生日を未来に設定することは出来ません。"}
 */
export function calculateAge(birthday: Date, now: Date = new Date()): number {
  if (birthday > now) {
    throw Error("誕生日を未来に設定することは出来ません。");
  }
  let age = now.getFullYear() - birthday.getFullYear();
  const currentMonth = now.getMonth();
  const birthdayMonth = birthday.getMonth();
  if (currentMonth < birthdayMonth) {
    age--;
  } else if (currentMonth == birthdayMonth) {
    if (now.getDate() < birthday.getDate()) {
      age--;
    }
  }
  return age;
}

/**
 * @remarks
 * 正常異常の返り値は若干好みやプロジェクトの規定にもよりますので、そのままにするか非常に迷ったのですが、
 * TS的には同じstringの空文字よりnullかundefinedを返した方が、関数を利用する側は型安全にハンドリング出来て便利なため、
 * 明示的にnullを返し、データフェッチが失敗して思ってたデータが取れなかった場合undefinedを返す形にしました。
 *
 * @returns {Promise<string | null | undefined>} フェッチしたビールデータの名前（'IPA'を含まない場合）またはnull（'IPA'を含む場合）。
 * @async
 */
export const getBeerNameExceptIPA = async (
  api: IApiBeerFetcher
): Promise<string | null | undefined> => {
  const beer = await api.fetch();
  if (!beer) return undefined; //データが無い場合
  if (beer instanceof Error) return undefined; //エラー時

  if (beer.name?.includes("IPA")) {
    return null;
  }
  return beer.name;
};

/**
 * @remarks
 * やっぱり来たか副作用起きまくり関数。
 * こりゃもうmock使って頑張るしかないですね。
 *
 * @param {string} text - 単語に分割する英文。
 * @param {(word: string) => void} callback - 分割した各単語を引数に取るコールバック関数。
 * @param {number} [delay=500] - コールバック関数を呼び出す間隔（ミリ秒）。デフォルトは500ミリ秒。
 * @returns {Promise<void>}
 * @async
 */
export async function splitAndInvoke(
  text: string,
  callback: (word: string) => void,
  delay = 500
): Promise<void> {
  const words = text.split(" ");

  for (const word of words) {
    callback(word);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
