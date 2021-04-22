import { Query, Resolver } from "@nestjs/graphql";
import { AssetsService } from "./assets.service";

@Resolver()
export class AssetsResolver {
  constructor(private assetsService: AssetsService) {}
  @Query((returns) => [String])
  async assets() {
    return this.assetsService.getAll();
  }
}
