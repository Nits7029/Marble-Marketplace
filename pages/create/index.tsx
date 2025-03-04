import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppLayout } from 'components/Layout/AppLayout'
import { RoundedIcon } from 'components/RoundedIcon'
import { Stack, Text } from '@chakra-ui/react'
import { getCurrentWallet } from 'util/sender-wallet'
import { Create } from 'icons'
import { nftViewFunction } from 'util/near'
import styled from 'styled-components'
import { default_image } from 'util/constants'
import { isMobile } from 'util/device'
import { GradientBackground } from 'styles/styles'

export default function Home() {
  const wallet = getCurrentWallet()
  const [ownedCollections, setOwnedCollections] = useState([])
  const fetchCollections = async () => {
    try {
      const data = await nftViewFunction({
        methodName: 'nft_get_series',
        args: {},
      })
      return data
    } catch (error) {
      console.log('nft_get_series Error: ', error)
      return []
    }
  }
  const fetchCollectionSize = async (id) => {
    try {
      const data = await nftViewFunction({
        methodName: 'nft_supply_for_series',
        args: {
          token_series_id: id,
        },
      })
      return data
    } catch (err) {
      console.log('nft supply for a collection error: ', err)
      return 0
    }
  }
  useEffect(() => {
    ;(async () => {
      let collections = []
      const collectionList = await fetchCollections()
      collectionList.forEach((collection) => {
        if (collection.creator_id === wallet.accountId) {
          collections.push(collection)
        }
      })
      const data = await Promise.all(
        collections.map(async (element) => {
          const el = await fetchCollectionSize(element.token_series_id)
          return el
        })
      )
      collections = collections.map((element, index) => {
        element.counts = data[index]
        element.media = element.metadata.media
          ? process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.media
          : default_image
        return element
      })
      setOwnedCollections(collections)
    })()
  }, [])
  return (
    <AppLayout fullWidth={true}>
      <Container>
        <Title>Create On Marble Dao</Title>
        <Collections>
          <Stack spacing={isMobile() ? '10px' : '30px'}>
            <SubTitle>Your Collection</SubTitle>
            <Link href={`/collection/create`} passHref>
              <Card>
                <IconWrapper>
                  <Create />
                </IconWrapper>
                <Text fontSize={isMobile() ? '14px' : '20px'} fontWeight="700">
                  Create A New Collection
                </Text>
              </Card>
            </Link>
            {ownedCollections.map((info, index) => (
              <Link
                href={`/collection/${info.token_series_id}`}
                key={index}
                passHref
              >
                <Card>
                  <RoundedIcon
                    size={isMobile() ? '50px' : '70px'}
                    src={info.media}
                    alt="collection"
                  />
                  <Stack marginLeft="20px">
                    <Text
                      fontSize={isMobile() ? '14px' : '20px'}
                      fontWeight="700"
                    >
                      {info.metadata.title}
                    </Text>
                    <Text
                      fontSize={isMobile() ? '14px' : '20px'}
                      fontWeight="600"
                      fontFamily="Mulish"
                    >
                      {info.counts} NFTs
                    </Text>
                  </Stack>
                </Card>
              </Link>
            ))}
          </Stack>
        </Collections>
      </Container>
    </AppLayout>
  )
}

const IconWrapper = styled.div`
  background: rgba(255, 255, 255, 0.16);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  @media (max-width: 650px) {
    width: 50px;
    height: 50px;
  }
`

const Container = styled.div`
  padding: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 50px;
  @media (max-width: 1024px) {
    padding: 100px 30px;
    row-gap: 30px;
  }
  @media (max-width: 650px) {
    padding: 10px;
  }
`

const Title = styled.div`
  font-size: 46px;
  font-weight: 600;
  text-align: center;
  @media (max-width: 1024px) {
    font-size: 30px;
  }
  @media (max-width: 650px) {
    font-size: 22px;
  }
`
const SubTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  @media (max-width: 650px) {
    font-size: 20px;
  }
`

const Collections = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  backdrop-filter: blur(30px);
  border-radius: 30px;
  max-width: 1000px;
  width: 100%;
  padding: 50px;
  border: 1px solid;
  border-image-source: linear-gradient(
    106.01deg,
    rgba(255, 255, 255, 0.2) 1.02%,
    rgba(255, 255, 255, 0) 100%
  );
  @media (max-width: 1024px) {
    padding: 20px;
  }
  @media (max-width: 650px) {
    padding: 20px;
  }
`
const Card = styled(GradientBackground)`
  &:before {
    opacity: 0.2;
    border-radius: 20px;
  }
  padding: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
`
