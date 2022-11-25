import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ChakraProvider,
  Flex,
  Stack,
  HStack,
  Text,
  Grid,
  Button,
} from '@chakra-ui/react'
import { nftViewFunction } from 'util/near'
import { NftCollection } from 'services/nft'
import SelectedNFT from './components/SelectedNFT'
import Collection from './components/Collection'
import { isMobile, isPC } from 'util/device'
import { SecondGradientBackground } from 'styles/styles'

const collectionList = [27, 111, 112]

const Home = () => {
  const [nftcollections, setNftCollections] = useState<NftCollection[]>([])

  const fetchCollections = async () => {
    // const data = await nftViewFunction({
    //   methodName: 'nft_get_series',
    //   args: {
    //     from_index: '111',
    //     limit: 1,
    //   },
    // })
    const data = await Promise.all(
      collectionList.map(async (collection_id) => {
        try {
          const _collectionInfo = await nftViewFunction({
            methodName: 'nft_get_series_single',
            args: {
              token_series_id: collection_id.toString(),
            },
          })
          return _collectionInfo
        } catch (err) {
          return {}
        }
      })
    )
    return data
  }

  useEffect(() => {
    // fetchCollections()
    ; (async () => {
      let collections = []
      let res_categories = await fetch(process.env.NEXT_PUBLIC_CATEGORY_URL)
      const collectionList = await fetchCollections()
      for (let i = 0; i < collectionList.length; i++) {
        let res_collection: any = {}
        try {
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL +
            collectionList[i].metadata.reference
          )
          res_collection = await ipfs_collection.json()
          let collection_info: any = {}
          collection_info.id = collectionList[i].token_series_id
          collection_info.name = res_collection.name
          collection_info.description = res_collection.description
          collection_info.image =
            process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
          collection_info.banner_image =
            process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
          collection_info.slug = res_collection.slug
          collection_info.creator = collectionList[i].creator_id ?? ''
          collection_info.cat_ids = 'All'
          collections.push(collection_info)
        } catch (err) {
          console.log('err', err)
        }
      }
      setNftCollections(collections)
    })()
  }, [])
  return (
    <Container>
      <ChakraProvider>
        <SelectedNFT />
        <Collections>
          <TextTitle>Curated Collections</TextTitle>
          <Stack spacing="50px" className='w-100'>
            {nftcollections.map((nftInfo, index) => (
              <Collection info={nftInfo} key={index} />
            ))}
          </Stack>
        </Collections>
        <Flex justifyContent="center" className="bg-border-linear m-2">
          <Paper>
            <MarbleCardGrid>
              <Stack spacing={10} className="pygital-nft">
                <Title>
                  <span style={{ fontWeight: '500' }}>Discover</span> Phygital
                  NFTs
                </Title>
                <TextContent textAlign={isMobile() ? 'center' : 'left'}>
                  Here at Marble DAO, the future of NFTs is already here.
                  Collect Phygital NFTs which bring real Art to life in
                  spectacular 3D. Enjoy sculptures, paintings, and physical
                  artworks through Augmented Reality and Virtual Reality.
                </TextContent>
                <StyledButton>Get Started</StyledButton>
              </Stack>
              <Stack className='double-card-img'>
                <img src="/images/download-card-3.png" alt="cardlogo" />
              </Stack>
            </MarbleCardGrid>
          </Paper>
        </Flex>
        <Stack marginTop="100px" alignItems="center" className='marble-content p-20'>
          <Stack spacing={10}>
            <Stack margin="0 auto" alignItems="center" spacing="30px">
              <TextTitle>Marble - Where will you fit in?</TextTitle>
              <StyledP>
                Marble is an all-in-one platform hosting an NFT marketplace as
                well as a DeFi exchange with DAO Governance. NFT creators,
                collectors and DeFi fans make us a rock-solid community. Here
                your opinion counts. Your creativity is protected. And your
                digital objects belong to you alone.
              </StyledP>
            </Stack>
            <DestinationGrid>
              <StyledPaper className="bg-border-linear">
                <Round>
                  <StyledImg src="/images/createIcon.svg" alt="create" />
                </Round>
                <Stack spacing={isPC() ? 5 : '5px'}>
                  <h1>Create</h1>
                  <TextContent>
                    Mint NFTs in stunning Augmented Reality (AR) and Virtual
                    Reality (VR).
                  </TextContent>
                </Stack>
              </StyledPaper>
              <StyledPaper className="bg-border-linear">
                <Round>
                  <StyledImg src="/images/earnIcon.svg" alt="earn" />
                </Round>
                <Stack spacing={isPC() ? 5 : '5px'}>
                  <h1>Earn</h1>
                  <TextContent>
                    Accrue royalties on secondary NFT sales using our smart
                    contracts.
                  </TextContent>
                </Stack>
              </StyledPaper>
              <StyledPaper className="bg-border-linear">
                <Round>
                  <StyledImg src="/images/followIcon.svg" alt="follow" />
                </Round>
                <Stack spacing={isPC() ? 5 : '5px'}>
                  <h1>Follow</h1>
                  <TextContent>
                    Keep an eye on your favourite NFT creators with Marble
                    SocialFi.
                  </TextContent>
                </Stack>
              </StyledPaper>
            </DestinationGrid>
          </Stack>
        </Stack>
        <Stack marginTop={isMobile() ? '50px' : '100px'} alignItems="center" className='marble-content'>
          <Stack spacing={isMobile() ? '10px' : 10} alignItems="center">
            <TextTitle>Marble is powered by</TextTitle>
            <StyledP>
              The Internet of Blockchains of Cosmos supports our journey from
              multi-chain to cross-chain. Our smart contracts are grounded in
              JUNO&apos;s versatile architecture and NEAR, one of the lean,
              powerful and fastest-growing blockchains. Then, as many top
              metaverses, Pinata offers a safe haven IPFS for NFT storage.
            </StyledP>
            <PartnerGrid>
              <PartnerPaper className="bg-border-linear">
                <StyledImg src="/images/near.svg" alt="near" />
              </PartnerPaper>
              <PartnerPaper className="bg-border-linear">
                <StyledImg src="/images/cosmos.svg" alt="cosmos" />
              </PartnerPaper>
              <PartnerPaper className="bg-border-linear">
                <StyledImg
                  src="/images/juno.svg"
                  alt="juno"
                  style={{ width: '150px' }}
                />
              </PartnerPaper>
              <PartnerPaper className="bg-border-linear">
                <StyledImg src="/images/pinata.svg" alt="pinata" />
              </PartnerPaper>
            </PartnerGrid>
          </Stack>
        </Stack>
      </ChakraProvider>
    </Container>
  )
}
const DestinationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    margin-top:0px !important;
  }
`
const PartnerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 30px;
  overflow: auto;
  @media (max-width: 650px) {
    width: 90vw;
  }
`
const StyledButton = styled.button`
  width: 250px;
  height: 68px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
  inset 0px 7px 8px rgba(0, 0, 0, 0.2);
  color: black;
  font-size: 18px;
  font-weight: bold;
  @media (max-width: 650px) {
    width: 100%;
    height: 56px !important;
    font-size: 16px;
  }
`
const MarbleCardGrid = styled.div`
  display:flex;
  align-items: center;
  
  @media (max-width: 1550px) {
    padding: 0 30px;
  }
  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column-reverse;
    * {
      align-items: center;
    }
  }
`
const StyledImg = styled.img`
  margin: 0 auto;
`
const Container = styled.div`
  color: white;
  @media (max-width: 1550px) {
    max-width: 1100px;
    margin-inline: auto;
  }
`
const StyledP = styled.div`
  color: white;
  font-size: 20px;
  font-weight:200;
  opacity: 0.5;
  font-family: Mulish;
  text-align: center;
  width: 1000px;
  @media (max-width: 1550px) {
    font-size: 18px;
  }
  @media (max-width: 1050px) {
    width: 100%;
  }
  @media (max-width: 650px) {
    font-size: 16px;
    padding: 0 20px;
    width: 100%;
  }
`
const Collections = styled.div`
  padding: 0px 0 100px;
  @media(max-width:640px){
    padding:50px 0;
  }
  @media(max-width:425px){
    padding:30px 0 20px;
  }
`

const Paper = styled(SecondGradientBackground)<{ width?: string }>`
  &:before {
    border-radius: 30px;
    opacity: 0.3;
  }
  padding: 40px 80px;
  width: ${({ width }) => width || '100%'};
  display: flex;
  align-items: center;
  @media (max-width: 1550px) {
    padding: 20px;
    display: block;
  }
  @media (max-width: 425px) {
    padding: 30px;
  }
`
const PartnerPaper = styled(Paper)`
    padding: 3px 28px !important;
      @media (max-width: 992px) {
      min-width: 180px;
      height: 70px;
      display:flex;
      align-items:center;
      justify-content:center;
    }

  @media (max-width: 650px) {
    width: 120px;
    height: 50px;
  }
`
const StyledPaper = styled(SecondGradientBackground)`
  &:before {
    opacity: 0.5;
    border-radius: 30px;
  }
  justify-content: center;
  padding: 40px 60px;
  flex-direction: column;
  h1 {
    font-size: 36px;
    font-weight: 500;
    text-align: center;
  }
  @media (max-width: 1550px) {
    padding: 40px 30px;
  }
  @media (max-width: 800px) {
    display: grid;
    justify-content: start;
    grid-template-columns: auto auto;
    padding: 10px;
    align-items: center;
    column-gap: 10px;
    h1 {
      font-size: 20px;
      font-weight: 500;
      text-align: left;
    }
    div {
      text-align: left;
    }
  }
`

const TextTitle = styled.div`
  font-size: 40px;
  font-weight: 500;
  margin-bottom:20px;
  text-align: center;
  @media (max-width: 1550px) {
    font-size: 35px;
    font-weight: 500;
  }
  @media (max-width: 650px) {
    font-size: 24px;
    margin-bottom:0;
    margin-top:50px;
  }
`

const TextContent = styled.div<{ textAlign?: string }>`
  font-size: 26px;
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'center')};
  font-weight: 300;
  opacity: 0.5;
  font-family: Mulish;
  @media (max-width: 1550px) {
    font-size: 20px;
  }
  @media (max-width: 650px) {
    font-size: 16px;
  }
`

const Round = styled.div`
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin: 50px auto;
  @media (max-width: 800px) {
    width: 70px;
    height: 70px;
    margin: 0;
    img {
      width: 30px;
      height: 30px;
    }
  }
`
const Title = styled.div`
  font-size: 65px;
  font-weight: 400;
  @media (max-width: 1550px) {
    font-size: 40px;
  }
  @media (max-width: 650px) {
    font-size: 30px;
    text-align: center;
  }
`
export default Home



