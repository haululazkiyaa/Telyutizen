// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getData } from "@/lib/firebase/service";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await getData("data");
  res.status(200).json({ status: true, statusCode: 200, data });
}
