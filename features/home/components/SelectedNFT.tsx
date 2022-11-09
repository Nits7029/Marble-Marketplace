import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Stack, Text, HStack } from '@chakra-ui/react'
import {
  nftViewFunction,
  marketplaceViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import { RoundedIconComponent } from 'components/RoundedIcon'
import { convertMicroDenomToDenom } from 'util/conversion'
import { useNearDollarValue } from 'hooks/useTokenDollarValue'

const SelectedNFT = () => {
  const [showData, setShowData] = useState<any>({})
  const nearValue = useNearDollarValue()
  const loadNft = useCallback(async () => {
    try {
      console.log("inside try");

      const [data, collection, marketData] = await Promise.all([
        nftViewFunction({
          methodName: 'nft_token',
          args: {
            token_id: `6:2`,
          },
        }),
        nftViewFunction({
          methodName: 'nft_get_series_single',
          args: {
            token_series_id: `6`,
          },
        }),
        marketplaceViewFunction({
          methodName: 'get_market_data',
          args: {
            nft_contract_id: NFT_CONTRACT_NAME,
            token_id: `6:2`,
          },
        }),
      ])
      console.log('marketData: ', marketData)
      setShowData({
        creator: collection.creator_id,
        collectionName: collection.metadata.title,
        collectionLogo:
          process.env.NEXT_PUBLIC_PINATA_URL + collection.metadata.media,
        price:
          marketData.price && convertMicroDenomToDenom(marketData.price, 24),
        nftLogo: process.env.NEXT_PUBLIC_PINATA_URL + data.metadata.media,
      })
    } catch (err) {
      console.log('NFT Contract Error: ', err)
      // debugger
    }
  }, [])
  useEffect(() => {
    loadNft()
  }, [])
  console.log('showData: ', showData)
  return (
    <IntroContainer className="p-20">
      <IntroWrapper>
        <Title>
          {/* TILL DEATH DO US PART */}
          Till Death Do Us Part
        </Title>
        <HStack spacing={5}>
          <MiniInfoCard className="bg-border-linear">
            <MiniInfoTitle>Created by</MiniInfoTitle>
            <RoundedIconComponent
              size="36px"
              address={showData.creator}
              font="16px"
            />
          </MiniInfoCard>
          <MiniInfoCard className="bg-border-linear">
            <MiniInfoTitle>Collection</MiniInfoTitle>
            <Info>
              <Image src={showData.collectionLogo} alt="logo" />
              <Name>&nbsp;{showData.collectionName}</Name>
            </Info>
          </MiniInfoCard>
        </HStack>
        {showData.price && (
          <PriceArea>
            <p>Price</p>
            <HStack alignItems="center">
              <p className='near-text'>{Number(showData.price.toFixed(2))} Near</p>
              <h2>${Number(showData.price.toFixed(2)) * nearValue}</h2>
            </HStack>
          </PriceArea>
        )}
        <Stack>
          <Link href="nft/6/2" passHref>
            <StyledButton>View Nft</StyledButton>
          </Link>
        </Stack>
      </IntroWrapper>
      <NFTPicture>
        <ImgDiv>
          <Img alt="logo" src={showData.nftLogo} />
        </ImgDiv>
      </NFTPicture>
    </IntroContainer>
  )
}
const StyledButton = styled.button`
  width: 326px;
  height: 68px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
    inset 0px 7px 8px rgba(0, 0, 0, 0.2);
  color: black;
  font-size: 18px;
  font-weight: 500;
  @media (max-width: 480px) {
    width: 100%;
    height: 58px;
  }
`

const IntroContainer = styled.div`

  flex-wrap: wrap;
  margin-top: 60px;
  height:100%;
  display: flex;
  justify-content:center;
  min-height: calc(100vh - 250px);
  position:relative;

  @media (max-width: 576px) {
    // flex-direction: column-reverse;
    padding: 0px;
    margin-top: 0px;
    justify-content:start;
  }

  &::after {
    content: "";
    background-image: url('/images/home-Vector.png');
    position: absolute;
    bottom: 0px;
    left: -210px;
    width: 100%;
    height: 100px;
    /* background-size: cover; */
    background-repeat: no-repeat;

    @media (max-width: 1024px) {
      bottom: -90px;
    }

    @media (max-width: 576px) {
      bottom: -90px;
      left: -140px;
      background-position-x: right;
    }
  }
  
`

const Title = styled.div`
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 70px;
  // padding: 40px 0;
  position:relative;

  @media (max-width: 1550px) {
    font-size: 35px;
  }
  @media (max-width: 480px) {
    font-size: 26px;
    text-align: center;
    margin-top: 20px;
    margin-bottom:20px;
    padding: 0 0 10px 0;
  }
  & :after {
    content:"";
    position:absolute;
    top: 65px;
    left:0;
    width: 109px;
    height:8px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 60px;
  }
`

const MiniInfoCard = styled.div`
position: relative;
width: 30%;
// box-shadow: rgb(42 47 50 / 9%) 0px 4px 40px, rgb(109 109 120) 0px 7px 24px inset;
// backdrop-filter: blur(40px);
border-radius: 20px;
padding: 15px;

@media (max-width: 1440px) {
  width: 100%;
  margin:0 auto;
}
  // &::before {
  //   content: "";
  //   position: absolute;
  //   inset: 0;
  //   border-radius: 20px;
  //   padding: 1px;
  //   background-color:#050616 !important ;
  //   background: -webkit-linear-gradient(161deg, rgba(42,47,50,0.9) 0%, rgba(109,109,120,1) 100%);
  //   -webkit-mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  //   -webkit-mask-composite: xor;
  //   mask-composite: exclude;
  //   opacity:0.8;
  // }

`

const MiniInfoTitle = styled.div`
  font-size: 16px;
  margin: 0 0 15px 0;
  // padding: 30px;
  font-weight:400;
  font-family: Mulish;

  @media (max-width: 1550px) {
    font-size: 16px;
  }
`
const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
  font-family: Mulish;
  margin-left:10px;
`
const Image = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ffffff;
`
const Info = styled.div`
  display: flex;
  align-items: center;
`
const NFTPicture = styled.div`
  max-width: 544px;
  width:100%;
  height:650px;
  margin-left:auto;
  flex:0 0 auto;
  border-radius: 30px;
  backdrop-filter: blur(15px);
  border: 1px solid;
  border-image-source: linear-gradient(
    90.65deg,
    #ffffff 0.82%,
    rgba(0, 0, 0, 0) 98.47%
  );
  background: linear-gradient(0deg,#32303d,#1e222e) padding-box,linear-gradient(90.65deg,#83818194 0.82%,rgba(0,0,0,0) 105.47%) border-box;
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  padding:37px;

     
  @media (max-width: 1440px) {
    margin-left: 0 !important;
    height:500px;
    max-width:500px;
  }
   
  @media (max-width: 1024px) {
    margin-left: 0 !important;
    height:500px;
    max-width:500px;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 20px;
    margin-left: 0 !important;
    height: 100%;
  }


  &:after {
    content:"";
    position:absolute;
    top: -2px;
    left:-5px;
    width:544px !important;
    height: 100% !important;
    // border:1px solid #fff;
    // box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4);
    // background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.06) 100%);
    z-index:-1;
    border-radius: 30px;

  @media (max-width: 1550px) {
    padding: 30px;
  }
  @media (max-width: 768px) {
    width: 100% !important;
  }
 
`
const ImgDiv = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
  border-radius: 20px;
`
const Img = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 40px;
`
const IntroWrapper = styled.div`
  flex: 0 0 auto;
  width: 58.33333333%;
  // row-gap: 40px;
  padding: 30px 0;

  @media (max-width: 1550px) {
    row-gap: 20px;
  }

  @media (max-width: 480px) {
    width:100%;
    order:2;
    padding:0;
  }
`
const PriceArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 30px;
  p {
    font-size: 20px;
    font-weight:300;
    margin: 30px 0 10px 0;
  }
  h1 {
    font-size: 45px;
    font-family: Mulish;
    font-weight: 800;
    line-height: 33px;
  }
  h2 {
    font-size: 20px;
    font-weight:400 !important;
    margin-left:20px !important;
    // margin-top: 10px !important;
  }
  @media (max-width: 1550px) {
    p {
      font-size: 16px;
    }
    h1 {
      font-size: 30px;
      font-family: Mulish;
    }
    h2 {
      font-size: 16px;
    }
  }
  @media (max-width: 480px) {
    align-items: center;
    margin-bottom: 16px;

    p {
      font-size: 14px;
    }
    h1 {
      font-size: 26px;
      font-family: Mulish;
    }
    h2 {
      font-size: 16px;
    }
  }
`

export default SelectedNFT
