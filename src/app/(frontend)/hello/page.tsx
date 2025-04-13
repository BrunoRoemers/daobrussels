import { keccak256, toUtf8Bytes } from 'ethers'
import { getAccountAddress, CommunityConfig } from '@citizenwallet/sdk'
import { getCommunity } from '@/services/cw'

export default function Hello() {
  const instanceId = keccak256(toUtf8Bytes('dao-brussels'))

  const community = getCommunity()
  const address = getAccountAddress(community, '0xc151840dF0C462AeBF868b42d412060318EBEC39')
  return (
    <div>
      {instanceId}-{address}
    </div>
  )
}
