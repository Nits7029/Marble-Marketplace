import React from 'react'
import Image from 'next/image'
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
import Select, { components } from 'react-select'
import { HERA_CONTRACT_NAME } from 'util/near'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'
import { isMobile } from 'util/device'
import { StyledCloseIcon } from 'components/Dialog'

const options = [
  {
    value: 'near',
    label: 'Near',
    icon: 'https://raw.githubusercontent.com/MarbleDAO/brand-assets/main/block.png',
  },
  {
    value: HERA_CONTRACT_NAME,
    label: 'Hera',
    icon: 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/juno.png',
  },
]

const OnSaleModal = ({
  setPrice,
  onHandle,
  nftInfo,
  setIsAuction,
  isAuction,
  setToken,
  token,
  setStartDate,
  setEndDate,
  setReservePrice,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { Option } = components
  const IconOption = (props) => (
    <Option {...props}>
      <HStack>
        <Image src={props.data.icon} width="50px" alt="src" />
        <Text>{props.data.label}</Text>
      </HStack>
    </Option>
  )

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '70px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2) !important',
      background: '#272734',
      color: '#FFFFFF',
    }),
    menuList: (base, state) => ({
      ...base,
      background: '#272734',
    }),
    option: (base, state) => ({
      ...base,
      color: 'white',
      background: '#272734',
      borderRadius: '20px',
      ':hover': {
        background: '#272734',
        opacity: '0.8',
      },
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'white',
    }),
    valueContainer: (base, state) => ({
      ...base,
      display: 'flex',
    }),
    menu: (base, state) => ({
      ...base,
      zIndex: '10',
    }),
  }
  return (
    <ChakraProvider>
      <Button
        className="btn-buy btn-default mobile-btn"
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
        Sell Your NFT
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
            <Stack spacing={isMobile() ? 3 : 10}>
              <Stack textAlign="center">
                <Title>Sell Your NFT</Title>
              </Stack>
              <Stack
                direction="row"
                spacing={isMobile() ? 5 : 20}
                justifyContent="center"
                alignItems="center"
              >
                <StyledRadio
                  onClick={(e) => setIsAuction(true)}
                  isActive={isAuction}
                >
                  <h1>Auction</h1>
                  <p>The highest offer wins the auction.</p>
                </StyledRadio>
                <StyledRadio
                  onClick={(e) => setIsAuction(false)}
                  isActive={!isAuction}
                >
                  <h1>Fixed Sale</h1>
                  <p>Fixed price to buy</p>
                </StyledRadio>
              </Stack>
              <Stack>
                <Text fontSize="14px">Payment Token</Text>
                <Select
                  defaultValue={options[0]}
                  options={options}
                  components={{
                    Option: IconOption,
                    SingleValue: IconOption,
                    IndicatorSeparator: () => null,
                    Input: () => null,
                  }}
                  styles={customStyles}
                  onChange={(e) => {
                    console.log('e.target.value: ', e)
                    setToken(e.value)
                  }}
                />
              </Stack>
              <Stack direction="row" alignItems="center" marginTop="20px">
                <Stack spacing={8} style={{ padding: '5px 0' }} width="100%">
                  <Stack
                    spacing={8}
                    flexDirection={isMobile() ? 'column' : 'row'}
                  >
                    <Stack width={!isAuction || isMobile() ? '100%' : '50%'}>
                      <Text marginLeft="20px">Price</Text>
                      <StyledInput
                        placeholder="Type your value"
                        type="number"
                        onChange={setPrice}
                      />
                    </Stack>
                    {isAuction && (
                      <Stack width={isMobile() ? '100%' : '50%'}>
                        <Text marginLeft="20px">Reserve Price</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="number"
                          onChange={setReservePrice}
                        />
                      </Stack>
                    )}
                  </Stack>

                  {isAuction && (
                    <Stack
                      spacing={8}
                      flexDirection={isMobile() ? 'column' : 'row'}
                    >
                      <Stack width={isMobile() ? '100%' : '50%'}>
                        <Text marginLeft="20px">Start at</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="datetime-local"
                          // value={startDate.toISOString()}
                          onChange={setStartDate}
                        />
                      </Stack>
                      <Stack width={isMobile() ? '100%' : '50%'}>
                        <Text marginLeft="20px">End at</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="datetime-local"
                          onChange={setEndDate}
                        />
                      </Stack>
                    </Stack>
                  )}
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
                  onHandle()
                }}
              >
                Put On Sale
              </Button>
              <Text margin="10px 0 0 0" fontSize={isMobile() ? '14px' : '20px'}>
                5% transaction fee goes to treasury wallet
              </Text>
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
    border-radius: 10px !important;
  }
`
const MainWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: start;
  column-gap: 30px;
  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`
const StyledRadio = styled.div<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? 'black' : 'white')};
  border-radius: 16px;
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 8px rgba(0, 0, 0, 0.2)'
      : 'inset 0px 7px 8px rgba(0, 0, 0, 0.2)'};
  border: ${({ isActive }) => (isActive ? '' : '1px solid #FFFFFF')};
  padding: 30px;
  width: 300px;
  height: 111px;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? '#FFFFFF' : '')};
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h1 {
    font-size: 22px;
    font-weight: 700;
  }
  p {
    font-size: 14px;
    font-family: Mulish;
  }
  @media (max-width: 480px) {
    width: 50%;
    padding: 15px;
    h1 {
      font-size: 20px;
    }
    p {
      font-size: 12px;
    }
  }
`

const StyledInput = styled(Input)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: #272734 !important;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09) !important;
  backdrop-filter: blur(40px) !important;
  border-radius: 20px !important;
  height: 70px !important;
`

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  @media (max-width: 480px) {
    font-size: 20px;
  }
`

export default OnSaleModal
