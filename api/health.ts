import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({
    status: "UP",
    aws_region: process.env.AWS_REGION,
    now_region: process.env.NOW_REGION,
    aws_default_region: process.env.AWS_DEFAULT_REGION,
  });
};
