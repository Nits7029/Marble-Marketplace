import React from 'react'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  // HStack,
  Text,
  Stack,
  InputGroup,
  // InputRightElement,
  Input,
} from '@chakra-ui/react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'
import { isMobile } from 'util/device'
import { StyledCloseIcon } from 'components/Dialog'

// const buttonCss =

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
      <TokenLogoWrapper className="token-logo-wrapper">
        <img src={tokenInfo?.logoURI} alt="token" width="35px" />
        <Text className='font-16'>{tokenInfo?.name}</Text>
      </TokenLogoWrapper>
    )
  }
  return (
    <ChakraProvider>
      <Button
        css={{
          background: '$white',
          color: '$black',
          stroke: '$black',
          width: '100%',
          fontWeight:'500',
        }}
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
        <Container className="bg-border-linear">
          <StyledCloseIcon onClick={onClose} offset={20} size="40px" />
          <MainWrapper>
            <Stack spacing={10} className="place-bid-col">
              <Stack>
                <Title>Place a Bid</Title>
                <p>
                  Once your bid is placed, you will be the highest bidder in the
                  auction.Learn more
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
                    className="enter-amt"
                  />

                  <StyledInputRightElement>
                    <TokenLogo />
                  </StyledInputRightElement>
                </InputGroup>
                <Stack
                  flexDirection={isMobile() ? 'row' : 'column'} css={{justifyContent:"space-between"}}className="token-available"
                >
                  <h1 className='fw-400'>Available Balance</h1>
                  <h1>
                    {tokenBalance.toFixed(2)}&nbsp;
                    {tokenInfo?.name}
                  </h1>
                </Stack>
              </Stack>

              <Button
                className="btn-buy btn-default btn-mobile"
                css={{
                  background: '$white',
                  color: '$black',
                  stroke: '$black',
                  width: '100%',
                  fontWeight:'500',
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
              <NftCard nft={nftInfo} id="" type=""/>
            </CardWrapper>
          </MainWrapper>
        </Container>
      </Modal>
    </ChakraProvider>
  )
}

const Container = styled(ModalContent)`
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 30px !important;
  padding: 70px;
  color: white !important;
  overflow: hidden;
  max-width: 1000px !important;
  margin: 50px;
  @media (max-width: 650px) {
    width: 90vw !important;
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
    margin: 0px;
  }
`
const MainWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  column-gap: 30px;
  overflow:auto;
  p {
    font-size: 20px;
    font-family: Mulish;
  }
  h1 {
    font-size: 20px;
  }
  @media (max-width: 650px) {
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
  @media (max-width: 650px) {
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-bottom: 20px;
  }
`
const StyledInput = styled(Input)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  padding: 15px;
  font-size: 30px;
  font-weight: 400;
  background: #272734;
  border-radius: 20px !important;
  display: flex;
  align-items: center;
  height: 70px !important;
  &:focus{
    box-shadow:none !important;
  }
`

const TokenLogoWrapper = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 60px;
  padding: 5px 20px 5px 10px;
  display: flex;
  align-items: center;
`

const StyledInputRightElement = styled.div`
  position: absolute;
  right: 30px;
  top: 50%;
  transform:translateY(-50%);
`
const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  @media (max-width: 650px) {
    font-size: 20px;
  }
`
export default PlaceBidModal
