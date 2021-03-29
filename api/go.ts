import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({
    query: req.query,
    message: "go",
  });
};
