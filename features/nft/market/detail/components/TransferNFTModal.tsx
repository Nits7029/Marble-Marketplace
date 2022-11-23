import React, { useState } from 'react'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  HStack,
  Text,
  Stack,
  Input,
} from '@chakra-ui/react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'
import { isMobile } from 'util/device'
import { StyledCloseIcon } from 'components/Dialog'

const TransferNFTModal = ({ nftInfo, onHandle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [address, setAddress] = useState('')
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
          marginLeft: "30px !important",
        }}
        variant="primary"
        size="large"
        onClick={onOpen}
      >
        Transfer NFT
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
            <Stack spacing={10} width={isMobile() ? '100%' : '55%'} className="mobile-transfer"> 
              <Stack>
                <Title>Transfer NFT</Title>
                <p style={{
                 fontWeight:"500",
                 maxWidth:'500px',
                }}>
                  Transfer the NFT to another user or wallet by entering a valid
                  address below
                </p>
              </Stack>
              <Stack className="my-1">
                <StyledInput
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
              </Stack>
              <Button
                className="btn-buy btn-default btn-mobile"
                css={{
                  background: '$white',
                  color: '$black',
                  stroke: '$black',
                  width: '100%',
                  fontWeight: '500',
                  height:'80px',
                }}
                variant="primary"
                size="large"
                onClick={() => {
                  onHandle(address)
                }}
              >
                Transfer NFT
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
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 30px !important;
  padding:100px 80px 100px 50px;
  color: white !important;
  max-width: 1320px !important;
  max-height: 760px;
  height:100%;
  margin:0 !important;
  @media (max-width: 1024px) {
    width: 90vw !important;
    padding: 10px;
    max-height: 720px;
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
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    padding:20px 5px;
    overflow: auto;
    p {
      font-size: 14px;
    }
  }
`
const CardWrapper = styled.div`
  display: flex;
  height: 556px;
  width: 434px;

  @media (max-width: 1024px) {
    margin: 0 auto;
    margin-bottom:30px;
    padding-bottom:0px;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-bottom: 20px;
  }
`
const StyledInput = styled.input`
  padding: 20px 30px;
  font-size: 20px;
  font-weight: 500;
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  font-family: Mulish;
  border-radius: 20px;
`
const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  @media (max-width: 480px) {
    font-size: 20px;
  }
`
export default TransferNFTModal
