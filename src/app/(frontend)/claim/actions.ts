'use server'

import { getCommunity } from '@/services/cw'
import { getAccountAddress, BundlerService, getCardAddress } from '@citizenwallet/sdk'
import { keccak256, toUtf8Bytes, Wallet } from 'ethers'

export const claim = async (userHash: string) => {
  const community = getCommunity()
  const senderHashedUserId = keccak256(toUtf8Bytes(userHash.trim()))
  const userHashAddress = await getCardAddress(community, senderHashedUserId)
  console.log('userHashAddress', userHashAddress)
  if (!userHashAddress) {
    return { error: 'Invalid user hash' }
  }

  const privateKey = process.env.SERVER_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('Private key is not set')
  }

  const signer = new Wallet(privateKey)
  const signerAddress = await getAccountAddress(community, signer.address)

  console.log('signerAddress', signerAddress)

  if (!signerAddress) {
    throw new Error('Could not find an account for you!')
  }

  const bundler = new BundlerService(community)

  const hash = await bundler.mintERC20Token(
    signer,
    community.primaryToken.address,
    signerAddress,
    userHashAddress,
    '1',
  )

  return { hash }
}
