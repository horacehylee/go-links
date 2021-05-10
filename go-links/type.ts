export interface Link {
  id: string;
  url: string;
}

export interface Storage {
  getAll(): Promise<Link[]>;
  get({ id }: { id: string }): Promise<Link | undefined>;
  add(link: Link): Promise<void>;
  remove({ id }: { id: string }): Promise<void>;
}
