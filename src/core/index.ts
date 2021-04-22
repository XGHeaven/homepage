export * from "./source";
export * from "./head";
import axios, { AxiosAdapter, AxiosInstance } from "axios";
import { SourceKey, Source, CreateSourceOptions } from "./source";

export interface SanIOptions {
  sourceKeyMapper: Record<string, string>;

  // getSourceDataStore: () => Record<string, string>
}

export class SanI {
  private http: AxiosInstance;
  private sourceKeyMapper: Record<string, string>;
  constructor(options: SanIOptions) {
    this.sourceKeyMapper = options.sourceKeyMapper;
    this.http = axios.create({});
  }

  createSource<P, D>(
    genKey: SourceKey<P>,
    options: CreateSourceOptions<P, D> = {}
  ): Source<P, D> {
    const source: Source<P, D> = {
      genKey: genKey,
      fetch: async (params) => {
        let data: any;
        const sourceKey = genKey(params);
        if (process.env.NODE_ENV === "production") {
          const realURL = this.sourceKeyMapper[sourceKey];
          const { data: jsString } = await this.http.get(realURL, {
            responseType: "text",
          });
          const startIndex = parseInt(jsString.substr(0, 10));
          data = JSON.parse(jsString.substr(startIndex));
        } else {
          data = await source.fetchRemote(params);
        }

        return data;
      },
      fetchRemote: async (params) => {
        const path = genKey(params);
        if (options.remoteSource) {
          return await options.remoteSource!(params, path);
        } else {
          let { data } = await axios.get(path);
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
          return data;
        }
      },
      fetchStatic: (params) => {
        const store = this.getSourceDataStore();
        const key = genKey(params);
        if (key in store) {
          return store[key];
        }

        return null;
      },
    };
    return source;
  }

  private getSourceDataStore(): Record<string, any> {
    return (window as any).__static_data || {};
  }
}
