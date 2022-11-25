import * as React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { IconWrapper } from 'components/IconWrapper'
import { Search, ColumnBig, ColumnSmall, Sidebar, ArrowLeft } from 'icons'
// import { CollectionFilter } from './filter'
import { NftTable } from 'components/NFT'

import { NftInfo } from 'services/nft'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  ChakraProvider,
  Tab,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/reducers'
import {
  nftFunctionCall,
  nftViewFunction,
  marketplaceViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import {
  NFT_COLUMN_COUNT,
  UI_ERROR,
  PROFILE_STATUS,
  FILTER_STATUS_TXT,
} from 'store/types'
import { getCurrentWallet } from 'util/sender-wallet'

let nftCurrentIndex
const MyCreatedNFTs = ({ id }) => {
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [filtered, setFiltered] = useState([])
  const [filterTab, setFilterTab] = useState('')
  // const profileData = useSelector((state: State) => state.profileData)
  // const { profile_status } = profileData
  const wallet = getCurrentWallet()
  const [nftCounts, setNftCounts] = useState({
    Auction: 0,
    'Direct Sell': 0,
    NotSale: 0,
  })
  const getCreatedNFTs = async () => {
    try {
      let createdNFTs = []
      const series = await nftViewFunction({
        methodName: 'nft_get_series',
        args: {},
      })
      const createdSeries = series.filter((serie) => serie.creator_id === id)
      await Promise.all(
        createdSeries.map(async (element) => {
          try {
            const nftsInSerie = await nftViewFunction({
              methodName: 'nft_tokens_by_series',
              args: {
                token_series_id: element.token_series_id,
              },
            })
            createdNFTs = [...createdNFTs, ...nftsInSerie]
          } catch (err) {
            return []
          }
        })
      )
      return createdNFTs
    } catch (err) {
      return []
    }
  }

  const fetchCreatedNFTs = useCallback(async () => {
    let collectionNFTs = []
    let counts = { Auction: 0, 'Direct Sell': 0, NotSale: 0 }
    const createdNFTs = await getCreatedNFTs()
    await Promise.all(
      createdNFTs.map(async (element) => {
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
      const { nftList, nft_counts }: any = await fetchCreatedNFTs()
      setNfts(nftList)
      setFiltered(nftList)
      setNftCounts(nft_counts)
      let hasMoreFlag = false
      setHasMore(hasMoreFlag)
      setLoading(false)
    })()
  }, [id])
  const getMoreNfts = async () => {
    return false
  }
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
  // border-radius: 30px;
  // backdrop-filter: blur(30px);
  // box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
  //   inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  // background: linear-gradient(
  //   180deg,
  //   rgba(255, 255, 255, 0.06) 0%,
  //   rgba(255, 255, 255, 0.06) 100%
  // );
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

export default MyCreatedNFTs
