import type { NextRequest } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  options: z.object({}),
  network: z.string(),
  addresses: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/)),
  snapshot: z.number(),
})

// This endpoint is compatible with https://snapshot.org/#/strategy/api-post.
// Each address receives a score of 1, effectively allowing any address to vote.
// ONLY USE FOR DEMO PURPOSES.
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
