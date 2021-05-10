import is from "@sindresorhus/is";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { error, getGoLinksClient } from "./utils";

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const { id, url } = req.body;
  if (!id || !is.string(id)) {
    res.status(400).json({ message: `id is required and should be string` });
    return;
  }
  if (!url || !is.urlString(url)) {
    res.status(400).json({ message: `url is required and should be string` });
    return;
  }
  await getGoLinksClient().add({ id, url });
  res
    .status(200)
    .json({ message: `link is added for ${JSON.stringify({ id, url })}` });
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || !is.string(id)) {
    res.status(400).json({ message: `id is required and should be string` });
    return;
  }
  await getGoLinksClient().remove({ id });
  res
    .status(200)
    .json({ message: `link is removed for ${JSON.stringify({ id })}` });
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const links = await getGoLinksClient().getAll();
  res.status(200).json({ links });
}

const handlers: any = {
  POST: handlePost,
  DELETE: handleDelete,
  GET: handleGet,
};

export default error(async (req: VercelRequest, res: VercelResponse) => {
  if (!req.method || is.undefined(req.method)) {
    res.status(400).json({ message: `method is required` });
    return;
  }
  // const adminToken = req.headers["admin-token"];
  // if (!adminToken || is.undefined(adminToken) || !is.string(adminToken)) {
  //   res.status(400).json({ message: `ADMIN_TOKEN is required for header` });
  //   return;
  // }
  // if (adminToken !== process.env.ADMIN_TOKEN) {
  //   res.status(400).json({ message: `ADMIN_TOKEN does not match` });
  //   return;
  // }
  const handler = handlers[req.method];
  if (!handler) {
    res.status(400).json({ message: `handler not specified` });
    return;
  }
  await handler(req, res);
});
