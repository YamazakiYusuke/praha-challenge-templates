import { ApiBeerFetcher, IApiBeerFetcher } from "../api/apiBeerFetcher";
import axios from "axios";

let timeoutError: boolean = false;
let fetchError: boolean = false;

const beerData: {} = {
    name: "Sample Beer",
    price: 500,
}

jest.mock('axios', () => ({
    get: jest.fn(async (url: string): Promise<any> => {
        if(timeoutError) throw new Error("A timeout error has occurred.");
        if(fetchError) throw new Error("faild to fetch data.");
        return { data: beerData }
    })
}));

describe("ApiBeerFetcher fetch", () => {

    const apiBeerFetcher: IApiBeerFetcher = new ApiBeerFetcher;

    beforeEach(() => {
        timeoutError = false;
        fetchError = false;
    });

    test('タイムアウトエラーが発生した場合、"ApiBeerFetcher request timed out"が返される', async () => {
        timeoutError = true;
        const actual: string = await apiBeerFetcher.fetch();
        expect(actual).toBe("ApiBeerFetcher request timed out");
    });

    test('タイムアウト以外のエラーが発生した場合、"ApiBeerFetcher failed to fetch data"が返される', async () => {
        fetchError = true;
        const actual: string = await apiBeerFetcher.fetch();
        expect(actual).toBe("ApiBeerFetcher failed to fetch data");
    });

    test('データが正常に取得できた場合、"Sample Beer"が返される', async () => {
        const actual: string = await apiBeerFetcher.fetch();
        expect(actual).toBe("Sample Beer");
    });
});