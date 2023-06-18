import axios from "axios";

export interface IApiNameFetcher {
    fetch(): Promise<string>;
}

export class ApiNameFetcher implements IApiNameFetcher {
    public async fetch(): Promise<string> {
        const { data } = await axios.get(
            "https://random-data-api.com/api/name/random_name"
        );
        return data.first_name as string;
    }
}
/**
 * ApiNameFetcherのMock
 * インスタンス生成時に任意のfirstNameをセット
 */
export class ApiNameFetcherMock implements IApiNameFetcher {
    private firstName: string;

    public constructor(firstName: string) {
        this.firstName = firstName;
    }

    public async fetch(): Promise<string> {
        return this.firstName;
    }
}
