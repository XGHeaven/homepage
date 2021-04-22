import { Injectable } from "@nestjs/common";
import { posix } from "path";
import * as url from "url";

@Injectable()
export class AssetsService {
  private assets = new Map<string, string>();

  getUrl(uri: string) {
    return url.format({
      protocol: "asset",
      pathname: uri,
      slashes: true,
    });
  }

  add(uri: string, filePath: string): string {
    const assetUrl = this.getUrl(uri);
    this.assets.set(assetUrl, filePath);
    return assetUrl;
  }

  has(uri: string) {
    return this.assets.has(this.getUrl(uri));
  }

  getFilePath(uri: string) {
    return this.assets.get(this.getUrl(uri));
  }

  getAll() {
    return Array.from(this.assets.keys());
  }
}
