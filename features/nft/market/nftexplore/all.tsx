import * as React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ChakraProvider, Spinner, Grid, LinkBox } from '@chakra-ui/react'
import styled from 'styled-components'
import {
  NFT_CONTRACT_NAME,
  nftViewFunction,
  marketplaceViewFunction,
} from 'util/near'
import { NftCard, NftCountsType } from 'components/NFT'
import { convertMicroDenomToDenom } from 'util/conversion'
import useAxios from 'hooks/useAxios'
import { useSelector } from 'react-redux'
import { nfts_per_page } from 'util/constants'
import {
  ExploreWrapper,
  Filter,
  FilterCard,
  CountWrapper,
  Container,
} from './styled'

const Explore = () => {
  const [nfts, setNfts] = useState([])
  const [nftCounts, setNftCounts] = useState<NftCountsType>({
    buynow: 0,
    activeOffer: 0,
    auction: 0,
  })
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const { countInfo } = useSelector((state: any) => state.uiData)
  const { getNftCounts, getAllNftIds } = useAxios()
  const fetchNfts = async () => {
    let collectionNFTs = []
    let counts = { Auction: 0, 'Direct Sell': 0, NotSale: 0, Offer: 0 }
    const tokenIds = await getAllNftIds(page, nfts_per_page)
    if (tokenIds.length < 12) setHasMore(false)
    const info = await nftViewFunction({
      methodName: 'nft_tokens_by_ids',
      args: {
        token_ids: tokenIds.map((id) => id.id),
      },
    })

    await Promise.all(
      info.map(async (element) => {
        let market_data
        // if (!element.metadata.extra) return
        try {
          market_data = await marketplaceViewFunction({
            methodName: 'get_market_data',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: element.token_id,
            },
          })
        } catch (error) {
          console.log('get_market_data error: ', error)
        }
        let res_nft: any = {}
        let res_collection: any = {}
        try {
          let ipfs_nft = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.reference
          )
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.extra
          )
          res_nft = await ipfs_nft.json()
          res_collection = await ipfs_collection.json()
        } catch (err) { }

        res_nft['tokenId'] = element.token_id.split(':')[1]
        res_nft['title'] = res_collection.name
        res_nft['owner'] = element.owner_id
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
      })
    )
    setNfts(nfts.concat(collectionNFTs))
    setPage(page + 1)
  }

  useEffect(() => {
    ;(async () => {
      const nftCounts = await getNftCounts()
      setNftCounts(nftCounts)
      await fetchNfts()
    })()
  }, [])
  const getMoreNfts = async () => {
    // await fetchNfts()
    await fetchNfts()
  }

  return (
    <ExploreWrapper style={{ padding: "0px" }}>
      <Filter className="collection-tab">
        <Link href="/explore/nfts" passHref>
          <FilterCard isActive={true} className="bg-border-linear">
            <CountWrapper>{countInfo.nft}</CountWrapper>All
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/buynow" passHref>
          <FilterCard className="bg-border-linear">
            <CountWrapper>{nftCounts.buynow}</CountWrapper>Buy Now
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/liveauction" passHref>
          <FilterCard className="bg-border-linear">
            <CountWrapper>{nftCounts.auction}</CountWrapper>Live Auction
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/activeoffer" passHref>
          <FilterCard className="bg-border-linear">
            <CountWrapper>{nftCounts.activeOffer}</CountWrapper>Active Offers
          </FilterCard>
        </Link>
      </Filter>
      {/* {loading ? (
        <ChakraProvider>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '20px',
            }}
          >
            <Spinner size="xl" />
          </div>
        </ChakraProvider>
      ) : (
        <InfiniteScroll
          dataLength={filtered.length}
          next={getMoreNfts}
          hasMore={hasMore}
          loader={
            <ChakraProvider>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  padding: '20px',
                }}
              >
                <Spinner size="xl" />
              </div>
            </ChakraProvider>
          }
          endMessage={<h4></h4>}
        >
          <Container>
            {filtered.map((nftInfo, index) => (
              <Link
                href={`/nft/${nftInfo.collectionId}/${nftInfo.tokenId}`}
                passHref
                key={index}
              >
                <LinkBox
                  as="picture"
                  transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
                  _hover={{
                    transform: 'scale(1.05)',
                  }}
                >
                  <NftCard nft={nftInfo} id="" type="" />
                </LinkBox>
              </Link>
            ))}
          </Container>
        </InfiniteScroll>
      )} */}
      <InfiniteScroll
        dataLength={nfts.length}
        next={getMoreNfts}
        hasMore={hasMore}
        loader={
          <ChakraProvider>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '20px',
              }}
            >
             {/* {loading && <Spinner size="xl" />} */}
            </div>
          </ChakraProvider>
        }
        endMessage={<h4></h4>}
      >
        <Container>
          {nfts.map((nftInfo, index) => (
            <Link
              href={`/nft/${nftInfo.collectionId}/${nftInfo.tokenId}`}
              passHref
              key={index}
            >
              <LinkBox
                as="picture"
                transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
                _hover={{
                  transform: 'scale(1.05)',
                }}
              >
                <NftCard nft={nftInfo} id="" type="" />
              </LinkBox>
            </Link>
          ))}
        </Container>
      </InfiniteScroll>
    </ExploreWrapper>
  )
}

// const ExploreWrapper = styled.div``
// const Container = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, minmax(0, 1fr));
//   padding: 40px 0;
//   gap: 30px;
//   max-width:100% !important;
  
//   @media (max-width:1200px){
//     grid-template-columns: repeat(2, minmax(0, 1fr));
//   }
//   @media (max-width:640px){
//     grid-template-columns: repeat(1, minmax(0, 1fr));
//   }
// `
// const Filter = styled.div`
//   display: flex;
//   column-gap: 20px;
//   max-width: 800px;
//   // padding:0 !important;
// `
// const FilterCard = styled.div`
//   border-radius: 30px;
//   backdrop-filter: blur(30px);
//   box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
//     inset 0px 14px 24px rgba(17, 20, 29, 0.4);
//   background: linear-gradient(
//     180deg,
//     rgba(255, 255, 255, 0.06) 0%,
//     rgba(255, 255, 255, 0.06) 100%
//   );
//   display: flex;
//   font-size: 16px;
//   font-weight: 500;
//   cursor: pointer;
//   font-family: Mulish;
//   align-items: center;
//   width: fit-content;
//   min-width:100px;
//   white-space:nowrap;
//   justify-content:center;
//   padding: 10px;
//   @media (max-width:576px){
//     font-size:14px !important;
//     height:55px;
//     min-width:120px;
//   }
// `
const NumberWrapper = styled.div<{ isActive: boolean }>`
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
  font-weight:400;
  font-size:13px;
`
export default Explore
