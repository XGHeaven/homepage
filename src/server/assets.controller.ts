import { Controller, Get, Req, Res } from "@nestjs/common";
import { AssetsService } from "./assets.service";
import { Request, Response } from "express";
import * as path from "path";

@Controller("/assets")
export class AssetsController {
  constructor(private assets: AssetsService) {}

  @Get("/*")
  async get(@Req() req: Request, @Res() res: Response) {
    const uri = decodeURI(path.relative("/assets", req.url));
    console.log(uri);
    if (this.assets.has(uri)) {
      res.sendFile(this.assets.getFilePath(uri)!);
      return;
    }

    res.status(404);
    res.end("404");
  }
}
