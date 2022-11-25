import { ChakraProvider, Spinner } from '@chakra-ui/react'
import { NftTable } from 'components/NFT'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { NftInfo } from 'services/nft'
import { State } from 'store/reducers'
import { NFT_COLUMN_COUNT } from 'store/types'
import {
  marketplaceViewFunction,
  nftViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'

export const MyCollectedNFTs = ({ id }) => {
  const [loading, setLoading] = useState(true)
  const pageCount = 10
  const [nfts, setNfts] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const dispatch = useDispatch()
  const [nftCounts, setNftCounts] = useState({
    Auction: 0,
    'Direct Sell': 0,
    NotSale: 0,
  })
  const [filtered, setFiltered] = useState([])
  const [filterTab, setFilterTab] = useState('')
  // const profileData = useSelector((state: State) => state.profileData)
  // const { profile_status } = profileData
  const wallet = getCurrentWallet()
  const fetchOwnedNFTs = useCallback(async () => {
    let ownedNFTs = []
    let collectionNFTs = []
    let counts = { Auction: 0, 'Direct Sell': 0, NotSale: 0 }
    try {
      ownedNFTs = await nftViewFunction({
        methodName: 'nft_tokens_for_owner',
        args: {
          account_id: id,
        },
      })
      console.log('ownedNFTs: ', ownedNFTs)
    } catch (err) {
      console.log('fetchOwnedNFTs Error: ', err)
    }
    await Promise.all(
      ownedNFTs.map(async (element) => {
        let res_nft: any = {}
        let res_collection: any = {}

        let market_data
        try {
          market_data = await marketplaceViewFunction({
            methodName: 'get_market_data',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: element.token_id,
            },
          })
        } catch (error) {
          console.log('error: ', error)
        }
        try {
          let ipfs_nft = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.reference
          )
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.extra
          )
          res_nft = await ipfs_nft.json()
          res_collection = await ipfs_collection.json()
          res_nft['tokenId'] = element.token_id.split(':')[1]
          res_nft['title'] = res_collection.name
          res_nft['image'] = process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri
          if (market_data) {
            res_nft['saleType'] = market_data.is_auction
              ? 'Auction'
              : 'Direct Sell'
            res_nft['price'] = market_data.price
            res_nft['started_at'] = market_data.started_at
            res_nft['ended_at'] = market_data.ended_at
            res_nft['current_time'] = market_data.current_time
            res_nft['ft_token_id'] = market_data.ft_token_id
          } else res_nft['saleType'] = 'NotSale'
          collectionNFTs.push(res_nft)
          counts[res_nft.saleType]++
        } catch (err) {
          console.log('err', err)
        }
      })
    )
    return { nftList: collectionNFTs, nft_counts: counts }
  }, [id])
  useEffect(() => {
    ;(async () => {
      const { nftList, nft_counts }: any = await fetchOwnedNFTs()
      setNfts(nftList)
      setFiltered(nftList)
      setNftCounts(nft_counts)
      setHasMore(true)
      setLoading(false)
    })()
  }, [id, fetchOwnedNFTs])
  const getMoreNfts = async () => {}
  const handleFilter = (id: string) => {
    if (id == filterTab) {
      setFilterTab('')
      setFiltered(nfts)
      return
    }
    const filteredNFTs = nfts.filter((nft) => nft.saleType === id)
    setFiltered(filteredNFTs)
    setFilterTab(id)
  }
  return (
    <CollectionWrapper>
      <NftList>
        <Filter className="collection-tab">
          <FilterCard className="bg-border-linear" onClick={() => handleFilter('Direct Sell')}>
            <NumberWrapper isActive={filterTab === 'Direct Sell'}>
              {nftCounts['Direct Sell']}
            </NumberWrapper>
            Buy Now
          </FilterCard>
          <FilterCard className="bg-border-linear" onClick={() => handleFilter('Auction')}>
            <NumberWrapper isActive={filterTab === 'Auction'}>
              {nftCounts['Auction']}
            </NumberWrapper>
            Live Auction
          </FilterCard>
          <FilterCard className="bg-border-linear" onClick={() => handleFilter('NotSale')}>
            <NumberWrapper isActive={filterTab === 'NotSale'}>
              {nftCounts['NotSale']}
            </NumberWrapper>
            Active Offers
          </FilterCard>
        </Filter>
        {loading ? (
          <ChakraProvider>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Spinner size="xl" />
            </div>
          </ChakraProvider>
        ) : (
          <InfiniteScroll
            dataLength={nfts.length}
            next={getMoreNfts}
            hasMore={false}
            loader={<h3> Loading...</h3>}
            endMessage={<h4></h4>}
          >
            <NftTable data={filtered} id="0" type="sell" nft_column_count={2} />
          </InfiniteScroll>
        )}
      </NftList>
    </CollectionWrapper>
  )
}

const CollectionWrapper = styled.div`
  @media (max-width: 650px) {
    width: fit-content;
  }
`

const NftList = styled.div``
const Filter = styled.div`
  display: flex;
  column-gap: 20px;
  margin-top: 35px;
`
const FilterCard = styled.div`
  border-radius: 50px;
  display: flex;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: Mulish;
  align-items: center;
  width: fit-content;
  padding: 10px;
  white-space:nowrap;

  @media (max-width: 650px) {
    font-size: 12px;
    padding:9px 22px 10px 9px;
    font-size:12px !important;
  }
`
const NumberWrapper = styled.div<{ isActive: boolean }>`
  width:34px;
  height: 34px;
  background: ${({ isActive }) =>
    isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ isActive }) => (isActive ? 'black' : 'white')};
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-right: 10px;
  font-size:13px;
  font-weight:400;
`
