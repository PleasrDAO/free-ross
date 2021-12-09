import { ethers, BigNumber } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { provider } from "../../lib/provider";

type Data = {
  value: string;
  bid: string;
};

const fmt = (bn: BigNumber) =>
  ethers.utils.commify(ethers.utils.formatUnits(bn.sub(bn.mod(1e15))));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const balance = await provider.getBalance(
    "0xc102d2544a7029f7BA04BeB133dEADaA57fDF6b4"
  );

  let display_bal = balance;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=15, stale-while-revalidate=30"
  );

  res.status(200).json({
    value: fmt(display_bal),
  });
}
