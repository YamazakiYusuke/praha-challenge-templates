import { ApiBeerFetcher } from "./api/apiBeerFetcher";


/**
 * `calculateAge`関数は、指定された誕生日から現在までの年齢を計算します。
 *
 * @remarks
 * この関数は、現在の年と誕生日の年の差を計算します。その後、現在の月が誕生日の月より前、
 * または同じ月でも現在の日が誕生日より前の場合には年齢を1つ減らします。
 * これにより、まだ誕生日を迎えていない年齢の計算が正しく行われます。
 *
 * @example
 * ```ts
 * const birthday = new Date(1990, 11, 15); // 1990年12月15日生まれ
 * const age = calculateAge(birthday);
 * console.log(age); // 現在までの年齢
 * ```
 *
 * @param {Date} birthday - 計算の基となる誕生日。
 * @returns {number} 計算された年齢。
 */
export function calculateAge(birthday: Date): number {
    const now = new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    let currentMonth = now.getMonth();
    let birthdayMonth = birthday.getMonth();
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
 * `getBeerNameExceptIPA`関数は、非同期にビールデータを取得し、ビールの名前が'IPA'を含まない場合にのみその名前を返します。
 * 名前が'IPA'を含む場合は空の文字列を返します。
 * 
 * @remarks
 * この関数は`ApiBeerFetcher`クラスを使用してビールデータをフェッチします。
 *
 * @example
 * ```ts
 * const beerName = await getBeerNameExceptIPA();
 * console.log(beerName); // IPAを含まないビールの名前、または空の文字列
 * ```
 *
 * @returns {Promise<string>} フェッチしたビールデータの名前（'IPA'を含まない場合）または空の文字列（'IPA'を含む場合）。
 * @async
 */
export const getBeerNameExceptIPA = async (
): Promise<string> => {
    const api = new ApiBeerFetcher();
    const beer = await api.fetch();
    if (beer.includes('IPA')) {
        return '';
    }
    return beer;
};

/**
 * `splitAndInvoke`関数は、与えられた英文を単語ごとに区切り、指定されたミリ秒数ごとにコールバック関数を呼び出します。
 *
 * @remarks
 * この関数は、与えられたテキストをスペースで区切ります。そして、それぞれの単語に対して、
 * 与えられたコールバック関数を呼び出し、その後指定されたミリ秒数だけ待ちます。デフォルトの待ち時間は500ミリ秒です。
 * 
 * @example
 * ```ts
 * const printWord = (word: string) => console.log(word);
 * await splitAndInvoke("Hello world", 1000, printWord); // "Hello"と"world"を1秒ごとにコンソールに出力
 * ```
 *
 * @param {string} text - 単語に分割する英文。
 * @param {(word: string) => void} callback - 分割した各単語を引数に取るコールバック関数。
 * @param {number} [delay=500] - コールバック関数を呼び出す間隔（ミリ秒）。デフォルトは500ミリ秒。
 * @returns {Promise<void>}
 * @async
 */
export async function splitAndInvoke(text: string, callback: (word: string) => void, delay: number = 500): Promise<void> {
    const words = text.split(' ');

    for (const word of words) {
        callback(word);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}