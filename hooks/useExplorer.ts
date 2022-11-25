import { useEffect } from 'react'
import { nftViewFunction } from 'util/near'
import { fetchAllProfileCounts } from 'hooks/useProfile'
import { COUNT_INFO } from 'store/types'
import { useDispatch } from 'react-redux'

const useExplorer = () => {
  const dispatch = useDispatch()
  async function fetchAllNFTCounts() {
    const allNFTs = await nftViewFunction({
      methodName: 'nft_total_supply',
      args: {},
    })
    return allNFTs
  }
  async function fetchAllCollectionCounts() {
    const allCollections = await nftViewFunction({
      methodName: 'nft_get_series_supply',
      args: {},
    })
    return allCollections
  }

  useEffect(() => {
    ;(async () => {
      const [totalNFTs, totalCollections, totalProfiles] = await Promise.all([
        fetchAllNFTCounts(),
        fetchAllCollectionCounts(),
        fetchAllProfileCounts(),
      ])

      dispatch({
        type: COUNT_INFO,
        payload: {
          nft: totalNFTs,
          collection: totalCollections,
          profile: totalProfiles,
        },
      })
    })()
  }, [])

  return null
}

export default useExplorer
