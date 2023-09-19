import { IApiBeerFetcher } from "../api/apiBeerFetcher";
import { calculateAge, getBeerNameExceptIPA, splitAndInvoke } from "../assignment4"
import { MockApiBeerFetcher } from "../__mocks__/apiBeerFetcher";

describe('calculateAge', () => {
    // 現在日時を「2023年6月1️日」に設定する
    beforeEach(() => {
        jest.useFakeTimers('modern').setSystemTime(new Date(2023, 6, 1).getTime());
    });

    // テスト終了時に設定した時刻をクリアする
    afterEach(() => {
        jest.useRealTimers();
    });

    test.each`
        birthYear | birthMonth | birthDay | expected 
        ${1995}   |    ${6}    |   ${1}   |   ${28} 
        ${1995}   |    ${5}    |   ${1}   |   ${28} 
        ${1995}   |    ${7}    |   ${1}   |   ${27}
        ${1995}   |    ${6}    |   ${2}   |   ${27} 
        ${2023}   |    ${5}    |   ${1}   |   ${0}  
    `("入力したbirthdayが「$birthYear年$birthMonth月$birthDay日 」の時、$expectedが返される", ({birthYear, birthMonth, birthDay, expected}) => {
        const inputBirthDay: Date = new Date(birthYear, birthMonth, birthDay);
        
        const actual: number = calculateAge(inputBirthDay);
        
        expect(actual).toBe(expected);
    });
});

describe("getBeerNameExceptIPA", () => {
    test('APIから取得したビールの名前が"Bud Light"の場合、"Bud Light"が返される', async () => {
        const apiBeerFetcher: IApiBeerFetcher = new MockApiBeerFetcher("Bud Light");

        const actual: string = await getBeerNameExceptIPA(apiBeerFetcher);

        expect(actual).toBe("Bud Light");
    });

    test('APIから取得したビールの名前が"Spiteful IPA"の場合、空文字("")が返される', async () => {
        const apiBeerFetcher: IApiBeerFetcher = new MockApiBeerFetcher("Spiteful IPA");

        const actual: string = await getBeerNameExceptIPA(apiBeerFetcher);

        expect(actual).toBe("");
    });
});

describe("splitAndInvoke", () => {
    const text: string = "Hello World";
    const delay: number = 100;
    let mockCallBack: () => void;
    
    describe('コールバック関数のテスト', () => {

        beforeEach(() => {
            mockCallBack = jest.fn();
        });
        
        test('textに"Hello World"が渡された場合、コールバック関数が2回呼ばれる', async () => {
            await splitAndInvoke(text, mockCallBack, delay);
            expect(mockCallBack).toHaveBeenCalledTimes(2);
        });
        
        test('textに"Hello World"が渡された場合、コールバック関数の引数は"Hello","World"', async () => {
            await splitAndInvoke(text, mockCallBack, delay);
            expect(mockCallBack).toHaveBeenCalledWith("Hello");
            expect(mockCallBack).toHaveBeenCalledWith("World");
        });
    });
    
    describe('delayのテスト', () => {
    
        beforeEach(() => {
            jest.useFakeTimers();
            mockCallBack = jest.fn();
        })

        afterEach(() => {
            jest.useRealTimers();
        })
    
        test('delayで渡されたミリ秒数たった後、コールバック関数が実行される', async () => {
            splitAndInvoke(text, mockCallBack, delay);

            jest.advanceTimersByTime(delay);
            await Promise.resolve();
            expect(mockCallBack).toHaveBeenCalledWith("Hello");
            
            jest.advanceTimersByTime(delay);
            await Promise.resolve();
            expect(mockCallBack).toHaveBeenCalledWith("World");
        });

        test('delayを渡さない場合、500ミリ秒間隔でコールバック関数が実行される', async () => {
            splitAndInvoke(text, mockCallBack);

            jest.advanceTimersByTime(500);
            await Promise.resolve();
            expect(mockCallBack).toHaveBeenCalledWith("Hello");
            
            jest.advanceTimersByTime(500);
            await Promise.resolve();
            expect(mockCallBack).toHaveBeenCalledWith("World");
        });
    })
})
