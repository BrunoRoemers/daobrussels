import { CommunityConfig } from '@citizenwallet/sdk'
import Community from './community.json'

export const getCommunity = () => {
  return new CommunityConfig(Community)
}
