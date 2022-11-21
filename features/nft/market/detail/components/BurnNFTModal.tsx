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

const BurnNFTModal = ({ nftInfo, onHandle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <ChakraProvider>
      <BurnButton className="btn-buy btn-default" onClick={onOpen}>
        Burn NFT
      </BurnButton>
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
            <Stack spacing={10} width={isMobile() ? '100%' : '55%'}>
              <Stack>
                <Title>Burn the NFT</Title>
                <p>
                  Burning an NFT destroys the NFT and removes it from your
                  creator profile. Please note, this action cannot be reversed.
                </p>
              </Stack>
              <BurnButton className="btn-buy btn-default" onClick={onHandle}>
                Burn the NFT
              </BurnButton>
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
  position: relative;
  max-width: 1320px !important;
  @media (max-width: 650px) {
    width: 90vw !important;
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
    border-radius: 10px !important;
  }
`
const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  @media (max-width: 650px) {
    font-size: 20px;
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
  height: 556px;
  width: 434px;
  @media (max-width: 650px) {
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-bottom: 20px;
  }
`
const StyledInput = styled.input`
  padding: 15px;
  font-size: 20px;
  font-weight: 600;
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  /* Note: backdrop-filter has minimal browser support */
  font-family: Mulish;
  border-radius: 20px;
  height: 70px;
`
const BurnButton = styled.div`
  background: #c80000;
  font-size: 18px;
  color: white;
  stroke: white;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  height: 70px;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
    inset 0px 7px 8px rgba(0, 0, 0, 0.2);
`

export default BurnNFTModal
