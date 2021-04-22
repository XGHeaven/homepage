import { Injectable, OnModuleInit } from "@nestjs/common";
import { Site } from "./site.model";
import * as fs from "fs-extra";
import * as path from "path";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AssetsService } from "../assets.service";

@Injectable()
export class SiteService implements OnModuleInit {
  private site!: Site;

  constructor(private assets: AssetsService) {}

  getSite() {
    return this.site;
  }

  async onModuleInit() {
    const data = await fs.readJSON(path.join(process.cwd(), "site.json"));
    const site = plainToClass(Site, data);
    const errors = await validate(site);
    if (errors.length) {
      throw new Error(errors[0].toString());
    }
    this.site = site;

    if (site.backgroundImage) {
      const imagePath = path.join(process.cwd(), site.backgroundImage);
      const uri = path.join(`site`, site.backgroundImage);
      const url = this.assets.add(uri, imagePath);
      site.backgroundImage = url;
    }

    if (site.avatar) {
      const imagePath = path.join(process.cwd(), site.avatar);
      const uri = path.join(`site`, site.avatar);
      const url = this.assets.add(uri, imagePath);
      site.avatar = url;
    }
  }
}
