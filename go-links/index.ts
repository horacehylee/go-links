import { Link, Storage } from "./type";

export interface GoLinksOptions {
  storage: Storage;
}

function goLinks({ storage }: GoLinksOptions) {
  const goLinks = {
    getAll: getAll,
    get: get,
    add: add,
    remove: remove,
  };

  async function getAll() {
    return await storage.getAll();
  }

  interface AddOptions {
    id: string;
    url: string;
  }
  async function add({ id, url }: AddOptions) {
    const link = await storage.get({ id });
    if (link) {
      throw new Error(`link is already defined with id '${id}'`);
    }
    await storage.add({ id, url });
  }

  interface GetOptions {
    id: string;
  }
  async function get({ id }: GetOptions) {
    const link = await storage.get({ id });
    if (!link) {
      throw new Error(`link cannot be found with id '${id}'`);
    }
    return link;
  }

  interface RemoveOptions {
    id: string;
  }
  async function remove({ id }: RemoveOptions) {
    const link = await storage.get({ id });
    if (!link) {
      throw new Error(`link cannot be found with id '${id}'`);
    }
    await storage.remove({ id });
  }
  return goLinks;
}

export default goLinks;
export { goLinks };
export type GoLinks = ReturnType<typeof goLinks>;
