import type { NextApiRequest, NextApiResponse } from 'next'
import { provider } from '../../lib/provider'

type Data = {
  value: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const currentBlock = await provider.getBlockNumber();

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=30'
  )

  res.status(200).json({
    value: 13770188 - currentBlock,
  })
}
