import {
  CommunityConfig,
  updateInstanceContractsCallData,
  createInstanceCallData,
} from '@citizenwallet/sdk'
import { Wallet, ZeroAddress } from 'ethers'
import { BundlerService, getAccountAddress, instanceOwner } from '@citizenwallet/sdk'
import { getCommunity } from '@/services/cw'

interface CommunityWithContracts {
  community: CommunityConfig
  contracts: string[]
}

const main = async () => {
  const community = getCommunity()

  const privateKey = process.env.SERVER_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('Private key is not set')
  }

  const signer = new Wallet(privateKey)

  const bundler = new BundlerService(community)
  const cardConfig = community.primarySafeCardConfig

  const owner = await instanceOwner(community)
  if (owner === ZeroAddress) {
    const ccalldata = createInstanceCallData(community, [
      community.primaryToken.address,
      community.community.profile.address,
    ])

    const signerAccountAddress = await getAccountAddress(community, signer.address)
    if (!signerAccountAddress) {
      throw new Error('Could not find an account for you!')
    }

    const hash = await bundler.call(signer, cardConfig.address, signerAccountAddress, ccalldata)

    console.log('submitted:', hash)

    await bundler.awaitSuccess(hash)

    console.log('Instance created')
  } else {
    console.log('Instance already exists')
  }
}

main()
