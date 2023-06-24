import { IApiNameFetcher } from "../api/apiNameFetcher";

export class NameApiService {
  private apiNameFetcher: IApiNameFetcher;
  private MAX_LENGTH = 4;
  public constructor(apiNameFetcher: IApiNameFetcher) {
    this.apiNameFetcher = apiNameFetcher;
  }

  public async getFirstName(): Promise<string> {
    const firstName = await this.apiNameFetcher.fetch()

    if (firstName.length > this.MAX_LENGTH) {
      throw new Error("firstName is too long!");
    }

    return firstName;
  }
}
