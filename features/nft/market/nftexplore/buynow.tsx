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
  TOKEN_DENOMS,
} from 'util/near'
import { NftCard, NftCountsType } from 'components/NFT'
import { convertMicroDenomToDenom } from 'util/conversion'
import useAxios from 'hooks/useAxios'
import { nfts_per_page } from 'util/constants'
import { useSelector } from 'react-redux'
import {
  ExploreWrapper,
  Filter,
  FilterCard,
  CountWrapper,
  Container,
} from './styled'

const Explore = () => {
  const [nfts, setNfts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [nftCounts, setNftCounts] = useState<NftCountsType>({
    buynow: 0,
    activeOffer: 0,
    auction: 0,
  })
  const { countInfo } = useSelector((state: any) => state.uiData)
  const { getTokenIds, getNftCounts } = useAxios()
  const fetchNfts = async () => {
    let collectionNFTs = []
    const tokenIds = await getTokenIds('sale', page, nfts_per_page)
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
        } catch (err) {}

        res_nft['tokenId'] = element.token_id.split(':')[1]
        res_nft['title'] = res_collection.name
        res_nft['owner'] = element.owner_id
        res_nft['image'] = process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri
        if (market_data) {
          res_nft['saleType'] = market_data.is_auction
            ? market_data.bids.length > 0
              ? 'Offer'
              : 'Auction'
            : 'Direct Sell'
          ;(res_nft['price'] = convertMicroDenomToDenom(
            market_data.price,
            TOKEN_DENOMS[market_data.ft_token_id]
          ).toFixed(2)),
            (res_nft['started_at'] = market_data.started_at)
          res_nft['ended_at'] = market_data.ended_at
          res_nft['current_time'] = market_data.current_time
          res_nft['ft_token_id'] = market_data.ft_token_id
          res_nft['highest_bid'] =
            market_data.bids &&
            market_data.bids.length > 0 &&
            convertMicroDenomToDenom(
              market_data.bids[market_data.bids.length - 1].price,
              TOKEN_DENOMS[market_data.ft_token_id]
            ).toFixed(2)
        } else res_nft['saleType'] = 'NotSale'
        collectionNFTs.push(res_nft)
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
    await fetchNfts()
  }
  return (
    <ExploreWrapper>
      <Filter>
        <Link href="/explore/nfts" passHref>
          <FilterCard>
            <CountWrapper>{countInfo.nft}</CountWrapper>All
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/buynow" passHref>
          <FilterCard isActive={true}>
            <CountWrapper>{nftCounts.buynow}</CountWrapper>Buy Now
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/liveauction" passHref>
          <FilterCard>
            <CountWrapper>{nftCounts.auction}</CountWrapper>Live Auction
          </FilterCard>
        </Link>
        <Link href="/explore/nfts/activeoffer" passHref>
          <FilterCard>
            <CountWrapper>{nftCounts.activeOffer}</CountWrapper>Active Offers
          </FilterCard>
        </Link>
      </Filter>

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
              <Spinner size="xl" />
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

export default Explore
