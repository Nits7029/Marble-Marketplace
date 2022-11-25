import { useEffect, useCallback } from 'react'
import axios from 'axios'
import { marketplace_subgraph_url, nft_subgraph_url } from 'util/constants'

const useAxios = () => {
  const getTokenIds = useCallback(
    async (filter, page, limit, activeOffer = false) => {
      const query = activeOffer
        ? `{
        nfts (first: ${limit}, skip: ${
            page * limit
          }, where: {marketStatus: "${filter}", bidCount_gt:0}) {
          id
          approvalId
        }
      }`
        : `{
      nfts (first: ${limit}, skip: ${
            page * limit
          }, where: {marketStatus: "${filter}"}) {
        id
        approvalId
      }
    }`
      const {
        data: {
          data: { nfts },
        },
      } = await axios.post(marketplace_subgraph_url, { query })
      return nfts
    },
    []
  )
  const getNftCounts = useCallback(async () => {
    const query = `{
      nftSortCounts {
        buynow
        activeOffer
        auction
      }
    }`
    const {
      data: {
        data: { nftSortCounts },
      },
    } = await axios.post(marketplace_subgraph_url, { query })
    console.log('nftSortCounts: ', nftSortCounts)
    return nftSortCounts[0]
  }, [])
  const getAllNftIds = useCallback(async (page, limit) => {
    const query = `{
      nfts(first: ${limit},skip: ${
      page * limit
    }, where: {isBurned: false}, orderBy: timestamp) {
        id
      }
    }`
    const {
      data: {
        data: { nfts },
      },
    } = await axios.post(nft_subgraph_url, { query })
    return nfts
  }, [])
  return { getTokenIds, getNftCounts, getAllNftIds }
}

export default useAxios
