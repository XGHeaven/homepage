export type SourceKey<P> = (params: P) => string;

export interface Source<P, D> {
  genKey(params: P): string;
  // fetch data from static or remote
  fetch(params: P): Promise<D>;
  // fetch data from remote dynamic source
  fetchRemote(params: P): Promise<D>;
  // fetch data from static data
  fetchStatic(params: P): D | null;
}

export interface CreateSourceOptions<P, D> {
  remoteSource?: (params: P, keyPath: string) => Promise<D> | D;
}
