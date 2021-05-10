import { VercelRequest, VercelResponse } from "@vercel/node";
import is from "@sindresorhus/is";
import { error, getGoLinksClient } from "./utils";

export default error(async (req: VercelRequest, res: VercelResponse) => {
  const { match } = req.query;
  if (!match) {
    res.status(400).json({ message: `"match" query param is required` });
    return;
  }
  if (!is.string(match)) {
    res
      .status(400)
      .json({ message: `"match" query param should only be string` });
    return;
  }
  const link = await getGoLinksClient().get({ id: match });
  res.redirect(link.url);
});
