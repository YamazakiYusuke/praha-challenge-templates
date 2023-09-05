import { IApiBeerFetcher } from "../api/apiBeerFetcher";

// beer の名前にIPAが含まれる
export class MockApiBeerFetcher implements IApiBeerFetcher{
    private beerName: string;

    constructor(beerName: string){
        this.beerName = beerName;
    }

    public async fetch(): Promise<string> {
        return this.beerName;
    }
}