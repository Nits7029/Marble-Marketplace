import getConfig from './config'
import axios from 'axios'
import { backend_url } from './constants'
import { refFiViewFunction } from './near'
import { toPrecision } from './numbers'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'
import { getCurrentWallet } from './sender-wallet'
import { getReducedAddress } from './conversion'
import { PINATA_SECONDARY_IMAGE_SIZE } from './constants'

const config = getConfig()

export interface RefPrice {
  price: string
}

export interface PoolRPCView {
  id: number
  token_account_ids: string[]
  token_symbols: string[]
  amounts: string[]
  total_fee: number
  shares_total_supply: string
  tvl: number
  token0_ref_price: string
  share: string
  decimalsHandled?: boolean
}

export const parsePoolView = (pool: any): PoolRPCView => ({
  id: Number(pool.id),
  token_account_ids: pool.token_account_ids,
  token_symbols: pool.token_symbols,
  amounts: pool.amounts,
  total_fee: pool.total_fee,
  shares_total_supply: pool.shares_total_supply,
  tvl: Number(toPrecision(pool?.tvl?.toString() || '0', 2, false, false)),
  token0_ref_price: pool.token0_ref_price,
  share: pool.share,
})

export const getPoolBalance = async (pool_id: number) => {
  return refFiViewFunction({
    methodName: 'get_pool_shares',
    args: {
      pool_id: pool_id,
      account_id: getCurrentWallet().wallet.getAccountId(),
    },
  }).then((balance) => {
    return new BigNumber(balance.toString()).toFixed()
  })
}

export const getPoolsBalances = async (pool_ids: number[]) => {
  return await Promise.all(
    pool_ids.map(async (pool_id) => await getPoolBalance(Number(pool_id)))
  )
}

export const getPools = async (counter: number) => {
  return refFiViewFunction({
    methodName: 'get_pools',
    args: { from_index: counter, limit: 300 },
  }).then((pools) => {
    pools.forEach(async (pool: any, i: number) => {
      pool.id = i + counter
      const pool_balance = await getPoolBalance(Number(pool.id) + counter)
      if (Number(pool_balance) > 0) {
        pools[i].share = pool_balance
      }
    })
    return pools
  })
}

export const getUserWalletTokens = async (): Promise<any> => {
  return await fetch(
    config.helperUrl +
      '/account/' +
      getCurrentWallet().wallet.getAccountId() +
      '/likelyTokens',
    {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }
  )
    .then((res) => res.json())
    .then((tokens) => {
      return tokens
    })
}

export const getCurrentUnixTime = async (): Promise<any> => {
  return await fetch(config.indexerUrl + '/timestamp', {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then((res) => res.json())
    .then((ts) => {
      return ts.ts
    })
    .catch(() => {
      return moment().unix()
    })
}

export const getLogoUriFromAddress = async (address) => {
  try {
    const { data } = await axios.get(`${backend_url}/get_simple_user`, {
      params: { id: address },
    })
    return {
      avatar: data.avatar
        ? process.env.NEXT_PUBLIC_PINATA_URL +
          data.avatar +
          PINATA_SECONDARY_IMAGE_SIZE
        : '/default.png' + PINATA_SECONDARY_IMAGE_SIZE,
      name: data.name || getReducedAddress(address),
    }
  } catch (err) {
    console.log('axios get logo uri error: ', err)
    return { avatar: '/default.png', name: getReducedAddress(address) }
  }
}
