import { ChakraProvider, Stack, Text, Flex, HStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DateCountdown from 'components/DateCountdownMin'
import { useTokenInfoFromAddress } from 'hooks/useTokenInfo'
import { getSimpleProfileInfo } from 'hooks/useProfile'
import { getReducedAddress } from 'util/conversion'
import { GradientBackground } from 'styles/styles'
import {
  PINATA_PRIMARY_IMAGE_SIZE,
  PINATA_SECONDARY_IMAGE_SIZE,
} from 'util/constants'

const saleType = {
  NotSale: 'Not On Sale',
  Auction: 'CURRENT BID',
  'Direct Sell': 'BUY NOW',
}

const backgroundColor = {
  NotSale: "linear-gradient(0deg, #191c2b, #212737) padding-box, linear-gradient(90.65deg, #565656 0.82%, rgba(0, 0, 0, 0)  124.47%) border-box !important",
  // Auction: 'rgba(219, 115, 115, 0.5)',
  Auction: 'linear-gradient(0deg,#743a3a,#9f6060) padding-box,linear-gradient(90.65deg,#fff 0.82%,rgba(0,0,0,0) 71.47%) border-box !important',
  // 'Direct Sell': '#FFFFFF',
  'Direct Sell': 'linear-gradient(0deg, #fff, #fff) padding-box, linear-gradient(90.65deg, #fff 0.82%, rgba(0, 0, 0, 0)  124.47%) border-box !important',
}

export function NftCard({ nft, id, type }): JSX.Element {
  const tokenInfo = useTokenInfoFromAddress(nft.ft_token_id)
  const [profile, setProfile] = useState<any>({})
  useEffect(() => {
    ;(async () => {
      const profile_info = await getSimpleProfileInfo(nft.owner)
      setProfile(profile_info)
    })()
  }, [nft])

  return (
    <NftCardDiv
      color={backgroundColor[nft.saleType]}
      revertColor={nft.saleType === 'Direct Sell'}
      className="bg-border-linear"
    >
      <ChakraProvider>
        <ImgDiv className="nft-img-url">
          <Image src={nft.image + PINATA_PRIMARY_IMAGE_SIZE} alt="NFT Image" />
        </ImgDiv>
        <Stack paddingTop="15px"  className='card-padding'>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <NFTName>{nft.name}</NFTName>
            <HStack>
              <Logo
                src={
                  profile.avatar
                    ? `${
                        process.env.NEXT_PUBLIC_PINATA_URL + profile.avatar
                      }${PINATA_SECONDARY_IMAGE_SIZE}`
                    : '/default.png' + PINATA_SECONDARY_IMAGE_SIZE 
                }
                alt="logo"
                size="34px"
              />
              <p>{profile.name || getReducedAddress(nft.owner)}</p>
            </HStack>
          </Flex>
          <Flex justifyContent="space-between" paddingTop="10px 0">
            <Stack>
              <Title>{saleType[nft.saleType]}</Title>
              {tokenInfo && (
                <Flex alignItems="center">
                  <Value>{nft.highest_bid || nft.price}</Value>
                  &nbsp;
                  <img
                    src={tokenInfo.logoURI + PINATA_SECONDARY_IMAGE_SIZE}
                    alt="token"
                    width="20px"
                    height="20px"
                    style={{ borderRadius: '50%' }}
                  />
                </Flex>
              )}
            </Stack>
            {(nft.saleType === 'Auction' || nft.saleType == 'Offer') && (
              <Stack>
                {tokenInfo && (
                  <Flex alignItems="center">
                    <Value>
                      {convertMicroDenomToDenom(
                        nft.price,
                        tokenInfo.decimals
                      ).toFixed(2)}
                    </Value>
                    &nbsp;
                    <img
                      src={tokenInfo.logoURI}
                      alt="token"
                      width="20px"
                      height="20px"
                    />
                  </Flex>
                )}
              </Stack>
            )}

            <HStack>
              <div>
                <div className='flex'>
                  <Logo
                    src={
                      profile.avatar
                        ? `${process.env.NEXT_PUBLIC_PINATA_URL + profile.avatar}`
                        : '/default.png'
                    }
                    alt="logo"
                    size="34px"
                  />
                  <p className={`ml-2 font-16 ${nft.saleType === 'Direct Sell' ? 'text-color': ''}`} >{profile.name || getReducedAddress(nft.owner)}</p>
                </div>

                {nft.saleType === 'Auction' && (
                  <Stack>
                    <Title>ENDS IN</Title>
                    <Timetrack className="">
                      <DateCountdown
                        dateTo={Number(nft.ended_at) / 1000000 || Date.now()}
                        dateFrom={Number(nft.current_time) * 1000}
                        interval={0}
                        mostSignificantFigure="none"
                        // className="vmn23"
                        numberOfFigures={3}
                      />
                    </Timetrack>
                  </Stack>
                )}

              </div>
            </HStack>
          </Flex>
        </Stack>
      </ChakraProvider>
    </NftCardDiv>
  )
}

const NftCardDiv = styled(GradientBackground)<{
  color: string
  revertColor: boolean
}>`
  &:before {
    border-radius: 20px;
    opacity: 0.2;
  }
  background: ${({ color }) => color};
  border-radius: 20px;
  padding: 30px;
  height: 100%;
  width: 100%;
  min-width: 320px;
  cursor: pointer;
  color: ${({ revertColor }) => (revertColor ? 'black' : 'white')};
  @media (max-width: 1550px) {
    padding: 20px;
  }
  p {
    font-size: 16px;
    font-family: Mulish;
    @media (max-width: 1550px) {
      font-size: 16px;
    }
    @media (max-width: 576px) {
      font-size: 14px;
    }
  }
  @media (max-width: 800px) {
    width: 320px;
  }

`
const NFTName = styled.div`
  font-size: 20px;
  font-weight:500;
  @media (max-width: 576px) {
    font-size: 16px;
  }
`
const Title = styled.div`
  font-size: 13px;
  font-weight:100;
  font-style:normal;
  margin:15px 0px 7px;
  @media (max-width: 1550px) {
    font-size: 12px;
  }
  @media (max-width: 576px) {
    margin: 10px 0px 7px;
    font-size:13px !important;
  }
`
const Value = styled.div`
  font-size: 18px;
  @media (max-width: 1550px) {
    font-size: 14px;
  }
`
const Timetrack = styled.div`
margin-top:0 !important;
  .dcd-info {
    font-size: 14px;
    @media (max-width: 1550px) {
      font-size: 12px;
    }
  }
  .dcd-val {
    font-size: 18px;
    @media (max-width: 1550px) {
      font-size: 14px;
    }
  }
`

const ImgDiv = styled.div`
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
  @media (max-width:576px){
    height:320px !important;
    padding-bottom:0;
  }
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
  
  @media (max-width:576px){
    height:320px !important;
  }
`
const Logo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`
