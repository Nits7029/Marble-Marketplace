import * as React from 'react'
import { ChakraProvider, Stack, HStack, LinkBox } from '@chakra-ui/react'
import Link from 'next/link'
import { NftCollection } from 'services/nft'
import { RoundedIconComponent } from 'components/RoundedIcon'
import { isClientMobie } from 'util/device'
import styled from 'styled-components'
import { GradientBackground } from 'styles/styles'
import {
  PINATA_PRIMARY_IMAGE_SIZE,
  PINATA_SECONDARY_IMAGE_SIZE,
} from 'util/constants'

export default function NftCollectionCard({ collection }): JSX.Element {
  return (
    <CollectionDiv className="collection bg-border-linear">
      <ImgDiv className="nft-img-div">
        <Image
          src={collection.image + PINATA_PRIMARY_IMAGE_SIZE}
          alt="NFT Image"
        />
      </ImgDiv>
      <HStack marginTop="30px">
        <Logo
          src={collection.banner_image + PINATA_SECONDARY_IMAGE_SIZE}
          alt="image"
        />
        <Stack>
          <Title>{collection.name}</Title>
          <RoundedIconComponent
            size="0px"
            address={collection.creator}
            font={isClientMobie ? '15px' : '15px'}
          />
        </Stack>
      </HStack>
    </CollectionDiv>
  )
}

// const CollectionDiv = styled.div`
//   border-radius: 20px;
//   padding: 30px;
//   height: 100%;
//   cursor: pointer;
//   min-width: 406px;
//   width: 100%;
//   @media (max-width: 1450px) {
//     padding: 15px;
//   }
//   @media (max-width: 480px) {
//     width: 320px;
//   }
// `

const ImgDiv = styled.div`
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
`

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
`
const Logo = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit:cover;
  @media (max-width: 1550px) {
    width: 50px;
    height: 50px;
  }
`
const Title = styled.div`
  font-size: 24px;
  overflow-wrap: anywhere;
  @media (max-width: 1450px) {
    font-size: 18px;
  }
`
const CollectionDiv = styled(GradientBackground)`
  &:before {
    border-radius: 20px;
    opacity: 0.2;
  }
  padding: 30px;
  height: 100%;
  cursor: pointer;
  @media (max-width: 1450px) {
    padding: 15px;
  }
  @media (max-width: 1024px) {
    width: 320px;
  }
`
