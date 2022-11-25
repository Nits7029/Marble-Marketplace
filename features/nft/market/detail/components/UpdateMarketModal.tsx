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
import { StyledCloseIcon } from 'components/Dialog'

const UpdateMarketModal = ({
  tokenInfo,
  onChange,
  onHandle,
  nftInfo,
  onReserveChange,
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
        Update Price
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container>
          <StyledCloseIcon onClick={onClose} offset={20} size="40px" />
          <MainWrapper>
            <Stack spacing={10} width={isMobile() ? '100%' : '600px'}>
              {/* <Stack>
                <Text fontSize='20px' fontWeight='600'></Text>
              </Stack> */}
              <Stack>
                <Text fontSize="20px">New Price</Text>
                <InputGroup>
                  <StyledInput
                    placeholder="Enter New Price"
                    type="number"
                    onChange={onChange}
                  />
                  <StyledInputRightElement>
                    <TokenLogo />
                  </StyledInputRightElement>
                </InputGroup>
              </Stack>
              <Stack>
                <Text fontSize="20px">New Reserve Price</Text>
                <InputGroup>
                  <StyledInput
                    placeholder="Enter New Reserve Price"
                    type="number"
                    onChange={onReserveChange}
                  />
                  <StyledInputRightElement>
                    <TokenLogo />
                  </StyledInputRightElement>
                </InputGroup>
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
                onClick={onHandle}
              >
                Update Price
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
  max-width: 1000px !important;
  margin: 50px;
  @media (max-width: 1024px) {
    padding: 50px 20px 20px 20px;
  }
  @media (max-width: 650px) {
    width: 90vw !important;
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
    border-radius: 10px !important;
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
  @media (max-width: 650px) {
    flex-direction: column-reverse;
    p {
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
  @media (max-width: 1024px) {
    right: 10px;
  }
`

export default UpdateMarketModal
