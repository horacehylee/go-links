import redisLib, { ClientOpts, RedisClient } from "redis";
import { Storage, Link } from "./type";
import { promisify } from "util";

interface Options extends ClientOpts {
  key: string;
  client: ClientOpts;
}

let client: RedisClient;

function redis({ client: clientOpts, key }: Options): Storage {
  if (!client) {
    client = redisLib.createClient(clientOpts);
  }
  client.on("error", function (err) {
    console.error(err);
  });
  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);

  async function getAll(): Promise<Link[]> {
    const json = await getAsync(key);
    if (!json) {
      return [];
    }
    return deserialize(json);
  }

  async function get({ id }: { id: string }): Promise<Link | undefined> {
    const links = await getAll();
    return links.find((link) => link.id === id);
  }

  async function add(link: Link): Promise<void> {
    const links = await getAll();
    links.push(link);
    await setAsync(key, serialize(links));
  }

  async function remove({ id }: { id: string }): Promise<void> {
    const links = await getAll();
    const filtered = links.filter((link) => link.id !== id);
    await setAsync(key, serialize(filtered));
  }

  function serialize(links: Link[]): string {
    return JSON.stringify(links);
  }

  function deserialize(str: string): Link[] {
    return JSON.parse(str);
  }

  return {
    getAll,
    get,
    add,
    remove,
  };
}

export { redis };
