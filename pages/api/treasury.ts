import { ethers, BigNumber } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { provider } from "../../lib/provider";
import Redis from "ioredis";

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
  const redis = new Redis(process.env.REDIS_URL);

  const [last_bid, last_bal, high_bal] = (
    await redis.mget("last_bid", "last_bal", "high_bal")
  ).map((v) => BigNumber.from(v));

  const balance = await provider.getBalance(
    "0xc102d2544a7029f7BA04BeB133dEADaA57fDF6b4"
  );

  let display_bal;
  let bid = last_bid;

  if (balance.gte(high_bal)) {
    redis.set("high_bal", balance.toString());
    display_bal = balance;
  } else {
    display_bal = balance.add(last_bid);
  }

  if (balance.lt(last_bal)) {
    bid = last_bal.sub(balance);
    redis.set("last_bid", bid.toString());
  }
  redis.set("last_bal", balance.toString());

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=15, stale-while-revalidate=30"
  );

  bid = BigNumber.from(bid.toNumber() / 1.03);

  res.status(200).json({
    value: fmt(display_bal),
    bid: fmt(bid),
  });
}
