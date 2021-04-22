import { Query, Resolver } from "@nestjs/graphql";
import { Site } from "./site.model";
import { plainToClass } from "class-transformer";
import { SiteService } from "./site.service";

@Resolver((of) => Site)
export class SiteResolver {
  constructor(private siteService: SiteService) {}

  @Query((returns) => Site)
  site() {
    return this.siteService.getSite();
  }
}
