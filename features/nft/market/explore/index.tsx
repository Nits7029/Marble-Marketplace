import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { ChakraProvider, Spinner } from '@chakra-ui/react'
import { Button } from 'components/Button'
import InfiniteScroll from 'react-infinite-scroll-component'
import { styled } from 'components/theme'
// import useSWR from 'swr';
import { getActivedCollections } from 'hooks/useCollection'
import { NFT_CONTRACT_NAME, nftViewFunction } from 'util/near'
import { CategoryTab, NftCollectionTable } from 'components/NFT'
import { NftCategory, NftCollection } from 'services/nft'

export const Explore = () => {
  const [nftcategories, setNftCategories] = useState<NftCategory[]>([])
  const [nftcollections, setNftCollections] = useState<NftCollection[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState('All')
  const [hasMore, setHasMore] = useState(true)
  const fetchCollections = async (categoryId, from_start = false) => {
    try {
      if (categoryId === 'All') {
        const data = await nftViewFunction({
          methodName: 'nft_get_series',
          args: {
            from_index: from_start ? '0' : nftcollections.length.toString(),
            limit: 12,
          },
        })
        return data
      } else {
        const activeCollectionIds = await getActivedCollections(
          categoryId,
          from_start ? 0 : nftcollections.length
        )
        const data = await nftViewFunction({
          methodName: 'nft_get_series_by_ids',
          args: {
            token_series_ids: activeCollectionIds,
          },
        })
        return data
      }
    } catch (error) {
      console.log('nft_get_series Error: ', error)
      setHasMore(false)
      return []
    }
  }
  useEffect(() => {
    // fetchCollections()
    ;(async () => {
      let res_categories = await fetch(process.env.NEXT_PUBLIC_CATEGORY_URL)
      let categories = await res_categories.json()
      setNftCategories(categories.categories)
      let collections = []
      const collectionList = await fetchCollections(activeCategoryId, true)
      for (let i = 0; i < collectionList.length; i++) {
        let res_collection: any = {}
        try {
          if (collectionList[i].metadata.reference) {
            let ipfs_collection = await fetch(
              process.env.NEXT_PUBLIC_PINATA_URL +
                collectionList[i].metadata.reference
            )
            res_collection = await ipfs_collection.json()
          }
        } catch (err) {
          console.log('err', err)
          res_collection = -{}
        }
        let collection_info: any = {}

        collection_info.id = collectionList[i].token_series_id
        collection_info.name = collectionList[i].metadata.title
        collection_info.description = res_collection.description
        collection_info.image = res_collection.featuredImage
          ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
          : '/default-image.png'
        collection_info.banner_image = res_collection.logo
          ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
          : '/default-image.png'
        collection_info.slug = res_collection.slug
        collection_info.creator = collectionList[i].creator_id ?? ''
        collections.push(collection_info)
      }
      setNftCollections(collections)
    })()
  }, [activeCategoryId])
  const getMoreNfts = async () => {
    let collections = []
    const collectionList = await fetchCollections(activeCategoryId)
    for (let i = 0; i < collectionList.length; i++) {
      let res_collection: any = {}
      try {
        let ipfs_collection = await fetch(
          process.env.NEXT_PUBLIC_PINATA_URL +
            collectionList[i].metadata.reference
        )
        res_collection = await ipfs_collection.json()
      } catch (err) {
        console.log('err', err)
        res_collection = {}
      }
      let collection_info: any = {}
      collection_info.id = collectionList[i].token_series_id
      collection_info.name = collectionList[i].metadata.title
      collection_info.description = res_collection.description
      collection_info.image = res_collection.featuredImage
        ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
        : '/default-image.png'
      collection_info.banner_image = res_collection.logo
        ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
        : '/default-image.png'
      collection_info.slug = res_collection.slug
      collection_info.creator = collectionList[i].creator_id ?? ''
      collections.push(collection_info)
    }
    setNftCollections(nftcollections.concat(collections))
  }
  return (
    <ExploreWrapper>
      <CategoryTab
        categories={nftcategories}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />

      <InfiniteScroll
        dataLength={nftcollections.length}
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
        <NftCollectionTable collections={nftcollections} />
      </InfiniteScroll>
    </ExploreWrapper>
  )
}

const ExploreWrapper = styled('div', {
  ' .category-menus': {
    borderBottom: '1px solid $borderColors$default',
    display: 'flex',
    // justifyContent: 'space-between',
    overFlow: 'hidden',
    '.bg-border-linear': {
        marginRight:'25px',
    },
    '&.desktop-section': {
      ' >span': {
        minWidth: '8%',
        textAlign: 'center',
        paddingBottom: '$8',
        cursor: 'pointer',
        '&.active': {
          borderBottom: '4px solid $selected',
        },
      },
    },
    '&.mobile-section': {
      ' >span': {
        minWidth: '18%',
        textAlign: 'center',
        paddingBottom: '$8',
        cursor: 'pointer',
        '&.active': {
          borderBottom: '4px solid $selected',
        },
      },
    },
  },
})
