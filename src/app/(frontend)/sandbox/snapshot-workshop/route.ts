import type { NextRequest } from 'next/server'
import { z } from 'zod'

const requestSchema = z
  .object({
    options: z.object({}),
    network: z.string(),
    addresses: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/)),
    snapshot: z.coerce.string(),
  })
  .passthrough()

// This endpoint is compatible with https://snapshot.org/#/strategy/api-post.
// Each address receives a score of 1, effectively allowing any address to vote.
// ONLY USE FOR DEMO PURPOSES.
//
// Example:
// curl -X POST https://daobrussels.vercel.app/sandbox/snapshot-workshop \
//   -H "Content-Type: application/json" \
//   -d '{
//     "options": {},
//     "network": "1",
//     "addresses": [
//       "0x76F536F370f89667804D1b02807e76d668ED4415"
//     ],
//     "snapshot": 11437846
//   }'
export const POST = async (request: NextRequest) => {
  const requestData = requestSchema.parse(await request.json())

  console.log(requestData)

  const scores = requestData.addresses.map((address) => {
    return {
      score: 1,
      address,
    }
  })

  const responseData = {
    score: scores,
  }

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
