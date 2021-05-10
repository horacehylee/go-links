import { Link, Storage } from "./type";

type Links = Record<Link["id"], Link>;
const links: Links = {};

function memory(): Storage {
  async function getAll(): Promise<Link[]> {
    return Object.values(links);
  }

  async function get({ id }: { id: string }): Promise<Link | undefined> {
    return links[id];
  }

  async function add(link: Link): Promise<void> {
    if (links[link.id]) {
      throw new Error("link already exists");
    }
    links[link.id] = link;
  }

  async function remove({ id }: { id: string }): Promise<void> {
    if (!links[id]) {
      throw new Error("link does not exist");
    }
    delete links[id];
  }

  return {
    getAll,
    get,
    add,
    remove,
  };
}

export { memory };
