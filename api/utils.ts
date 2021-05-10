import is from "@sindresorhus/is";
import { VercelRequest, VercelResponse } from "@vercel/node";
import goLinks, { GoLinks } from "../go-links";
import { redis } from "../go-links/redis";

let client: GoLinks;

export function getGoLinksClient() {
  if (!client) {
    client = goLinks({
      storage: redis({
        client: {
          host: process.env.REDIS_HOST,
          port: getInt(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
        key: `goLinks`,
      }),
    });
  }
  return client;
}

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void>;
export const error = (handler: Handler): Handler => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: `Error has occured: ${
        is.error(error) ? error.message : JSON.stringify(error)
      }`,
    });
  }
};

function getInt(str: string | undefined) {
  if (is.undefined(str)) {
    return str;
  }
  return parseInt(str);
}
