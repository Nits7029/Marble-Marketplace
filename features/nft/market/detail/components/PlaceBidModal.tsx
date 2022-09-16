import React from 'react'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  HStack,
  Text,
  Stack,
  InputGroup,
  InputRightElement,
  Input,
} from '@chakra-ui/react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'
import { isMobile } from 'util/device'

const PlaceBidModal = ({
  tokenInfo,
  tokenBalance,
  onChange,
  price,
  onHandle,
  nftInfo,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const TokenLogo = () => {
    return (
      <TokenLogoWrapper>
        <img src={tokenInfo?.logoURI} alt="token" width="35px" />
        <Text>{tokenInfo?.name}</Text>
      </TokenLogoWrapper>
    )
  }
  console.log('nftINfo: ', nftInfo)
  return (
    <ChakraProvider>
      <Button
        className="btn-buy btn-default"
        css={{
          background: '$white',
          color: '$black',
          stroke: '$black',
          width: '100%',
        }}
        variant="primary"
        size="large"
        onClick={onOpen}
      >
        Place Bid
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container>
          <MainWrapper>
            <Stack spacing={10}>
              <Stack>
                <Title>Place a Bid</Title>
                <p>
                  Once your bid is placed, you will be the highest bidder in the
                  auction.<a href="/">Learn more</a>
                </p>
              </Stack>
              <Stack>
                <h1>
                  Minimum Price:{' '}
                  <span style={{ fontWeight: '300' }}>
                    {Number(nftInfo.highest_bid) * 1.05 ||
                      Number(nftInfo.price)}{' '}
                    {tokenInfo.name}
                  </span>
                </h1>
                <InputGroup>
                  <StyledInput
                    placeholder="Enter amount"
                    type="number"
                    onChange={onChange}
                    value={price}
                  />
                  <StyledInputRightElement children={<TokenLogo />} />
                </InputGroup>
                <Stack
                  justifyContent="space-between"
                  flexDirection={isMobile() ? 'row' : 'column'}
                  alignItems="center"
                >
                  <h1>Available Balance</h1>
                  <h1>
                    {tokenBalance.toFixed(2)}&nbsp;
                    {tokenInfo?.name}
                  </h1>
                </Stack>
              </Stack>

              <Button
                className="btn-buy btn-default"
                css={{
                  background: '$white',
                  color: '$black',
                  stroke: '$black',
                  width: '100%',
                }}
                variant="primary"
                size="large"
                onClick={() => {
                  if (price > tokenBalance) return
                  onHandle()
                }}
                disabled={price > tokenBalance}
              >
                {price > tokenBalance
                  ? `You Do Not Have Enough ${tokenInfo?.name}`
                  : 'Place Bid'}
              </Button>
            </Stack>
            <CardWrapper>
              <NftCard nft={nftInfo} id="" type="" />
            </CardWrapper>
          </MainWrapper>
        </Container>
      </Modal>
    </ChakraProvider>
  )
}

const Container = styled(ModalContent)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border-radius: 30px !important;
  padding: 70px;
  color: white !important;
  overflow: hidden;
  max-width: 1320px !important;
  @media (max-width: 480px) {
    width: 90vw !important;
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
  }
`
const MainWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: start;
  column-gap: 30px;
  p {
    font-size: 20px;
    font-family: Mulish;
  }
  h1 {
    font-size: 20px;
  }
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    p {
      font-size: 14px;
    }
    h1 {
      font-size: 14px;
    }
  }
`
const CardWrapper = styled.div`
  display: flex;
  height: 556px;
  width: 434px;
  @media (max-width: 480px) {
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-bottom: 20px;
  }
`
const StyledInput = styled(Input)`
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  font-size: 30px;
  font-weight: 600;
  background: #272734;
  border-radius: 20px !important;
  display: flex;
  align-items: center;
  height: 70px !important;
`

const TokenLogoWrapper = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 60px;
  padding: 10px 20px 10px 10px;
  display: flex;
  align-items: center;
`

const StyledInputRightElement = styled.div`
  position: absolute;
  right: 30px;
  top: 8px;
`
const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  @media (max-width: 480px) {
    font-size: 20px;
  }
`
export default PlaceBidModal
