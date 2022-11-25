import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import {
  ChakraProvider,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Button } from 'components/Button'
import Select, { components } from 'react-select'
import { AppLayout } from 'components/Layout/AppLayout'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import {
  failToast,
  getURLInfo,
  successToast,
  getErrorMessage,
} from 'components/transactionTipPopUp'
import { nftFunctionCall, nftViewFunction, checkTransaction } from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'
import { createNewCollection } from 'hooks/useCollection'
import { isMobile } from 'util/device'
const options = [
  {
    value: 'Digital',
    label: 'Digital',
  },
  {
    value: 'Physical',
    label: 'Physical',
  },
  {
    value: 'Music',
    label: 'Music',
  },
  {
    value: 'Painting',
    label: 'Painting',
  },
  {
    value: 'Videos',
    label: 'Videos',
  },
  {
    value: 'Photography',
    label: 'Photography',
  },
  {
    value: 'Sports',
    label: 'Sports',
  },
  {
    value: 'Utility',
    label: 'Utility',
  },
]
export default function Collection() {
  const router = useRouter()
  const wallet = getCurrentWallet()
  const [name, setName] = useState('')
  const { txHash, pathname, errorType } = getURLInfo()
  const [category, setCategory] = useState('Digital')
  const [royaltyValues, setRoyaltyValues] = useState([
    { name: wallet.accountId, price: '10' },
  ])
  const handleRoyaltyChange = (i, e) => {
    const newFormValues = [...royaltyValues]
    if (e.target.value < 0) {
      toast.warning('Royalty must be greater than zero.')
      return
    }
    newFormValues[i][e.target.name] = e.target.value

    setRoyaltyValues(newFormValues)
  }
  const addFormFields = () => {
    setRoyaltyValues([...royaltyValues, { name: '', price: '' }])
  }

  const removeFormFields = (i, e) => {
    const newFormValues = [...royaltyValues]
    newFormValues.splice(i, 1)
    setRoyaltyValues(newFormValues)
  }

  const handleChange = async () => {
    if (!wallet.accountId) {
      toast.warning(`Please connect your wallet.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    if (name == '') {
      toast.warning(`Please input the collection name.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    const royalty = {}
    let totalRoyalty = 0
    royaltyValues.forEach((element) => {
      if (!element.price || !element.name) return
      royalty[element.name] = Number(element.price) * 100
      totalRoyalty += Number(element.price)
    })
    if (totalRoyalty > 70) {
      toast.warning(`Maximum royalty cannot exceed 70%.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    try {
      await nftFunctionCall({
        methodName: 'nft_create_series',
        args: {
          token_metadata: {
            copies: 10000,
            title: name,
          },
          price: null,
          royalty: royalty,
          creator_id: wallet.accountId,
        },
        amount: '0.00854',
      })
    } catch (error) {
      console.log('Create series error: ', error)
    }
  }

  useEffect(() => {
    if (txHash && wallet.accountId) {
      checkTransaction(txHash)
        .then((res: any) => {
          const transactionErrorType = getErrorMessage(res)
          const transaction = res.transaction
          return {
            isSuccess:
              transaction?.actions[0]?.['FunctionCall']?.method_name ===
              'nft_create_series',
            transactionErrorType,
          }
        })
        .then(({ isSuccess, transactionErrorType }) => {
          if (isSuccess) {
            transactionErrorType && failToast(txHash, transactionErrorType)
            if (!transactionErrorType && !errorType) {
              successToast(txHash)
              const parsedLog = JSON.parse(logs)
              createNewCollection({
                id: parsedLog?.params?.token_series_id,
                creator: parsedLog?.params?.creator_id,
                category: parsedLog?.params?.token_metadata.description,
              })
                .then((total) => {
                  console.log('inputData total: ', total)
                  createNewCollection({
                    id: total,
                    creator: wallet.accountId,
                    category,
                  })
                    .then((data) => {
                      console.log('backend collection data: ', data)
                    })
                    .catch((err) => {
                      console.log('backend collection data: ', err)
                    })
                })
                .catch((err) => {
                  console.log('get total series error: ', err)
                })
            }
            transactionErrorType && failToast(txHash, transactionErrorType)
            router.push(pathname)
            return
          }
        })
    }
  }, [txHash])
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
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      maxHeight: '400px',
    }),
    option: (base, state) => ({
      ...base,
      color: 'white',
      background: '#272734',
      ':hover': {
        background: 'rgba(255, 255, 255, 0.1)',
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
      margin: '0px',
      background: 'none',
    }),
  }
  return (
    <AppLayout fullWidth={true}>
        {/* {wallet.accountId && ( */}
        <Container>
          <Stack spacing={isMobile() ? '20px' : '50px'}>
            <Title>Create On Marble Dao</Title>
            <Collections className="bg-border-linear">
              <Stack spacing={isMobile() ? '20px' : '50px'}>
                <Stack alignItems="center" className='create-col'>
                  <CardTitle>Create A Collection</CardTitle>
                  <SubText className="create-text">Deploy a smart contract to showcase NFTs</SubText>
                </Stack>
                <HorizontalDivider />
                <Stack className="set-up">
                  <SubTitle>Set Up Your Smart Contract</SubTitle>
                  <SubText>
                    The following details are used to create your smart
                    contract. They will be added to the blockchain and cannot be
                    edited.
                  </SubText>
                  <StyledLink>Learn more about smart contracts</StyledLink>
                </Stack>
                <Stack className="collection-input">
                  <InputLabel>Collection Name</InputLabel>
                  <StyledInput
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </Stack>
                <Stack className="collection-input">
                  <InputLabel>Collection Category</InputLabel>
                  <Select className='select-input'
                    defaultValue={options[0]}
                    options={options}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    styles={customStyles}
                    onChange={(e) => {
                      setCategory(e.value)
                    }}
                  />
                </Stack>
                <Stack>
                  <SubTitle className="royalty">ROYALTY</SubTitle>
                  <Text fontSize="16px" fontWeight="400" fontFamily="Mulish" maxWidth="560px" className="text-sm">
                    Enable a split to autonatically divide any funds or
                    royalties earned from the NFT with up to five recipients,
                    including yourself.
                  </Text>
                </Stack>
                <Stack width="100%">
                  {royaltyValues.map((element, index) => (
                    <Grid templateColumns="repeat(2, 1fr)" gap={40} key={index} className="collection-grid">
                      <Stack>
                        {index === 0 && (
                          <RoyaltyLabel>Account Name</RoyaltyLabel>
                        )}
                        <StyledInput
                          name="name"
                          value={element.name || ''}
                          onChange={(e) => handleRoyaltyChange(index, e)}
                        />
                      </Stack>

                      <HStack justifyContent="space-between">
                        <Stack width={index ? '80%' : '100%'}>
                          {index === 0 && (
                            <RoyaltyLabel>Percentage Fee(%)</RoyaltyLabel>
                          )}
                          <StyledInput
                            name="price"
                            type="number"
                            value={element.price || ''}
                            onChange={(e) => handleRoyaltyChange(index, e)}
                            style={{ marginRight: '20px' }}
                          />
                        </Stack>
                        {index ? (
                          <IconWrapper width="70px" >
                            <IconButton
                              aria-label="icon"
                              icon={<CloseIcon />}
                              onClick={(e) => removeFormFields(index, e)}
                            />
                          </IconWrapper>
                        ) : null}
                      </HStack>
                    </Grid>
                  ))}
                  {royaltyValues.length < 5 && (
                    <IconWrapper className='add-icon'>
                      <IconButton
                        aria-label="icon"
                        icon={<AddIcon/>}
                        onClick={addFormFields}
                        width="100%"
                      />
                    </IconWrapper>
                  )}
                </Stack>
                <Stack padding="0 20%" className='p-0'>
                  <Button
                    className="btn-buy btn-default btn-padding"
                    css={{
                      background: '$white',
                      color: '$black',
                      stroke: '$black',
                      width: '100%',
                      padding: '20px',
                      fontWeight: "500",
                      marginTop:"10px !important",
                    }}
                    variant="primary"
                    size="large"
                    onClick={handleChange}
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </Collections>
          </Stack>
        </Container>
        {/* )} */}
    </AppLayout>
  )
}

const Container = styled.div`
  padding: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1024px) {
    padding: 100px 50px;
  }
  @media (max-width: 650px) {
    padding: 10px;
  }
`
const HorizontalDivider = styled.div`
  border-bottom: 1px solid #363b4e;
  width: 100%;
`

const Title = styled.div`
  font-size: 46px;
  font-weight: 500;
  text-align: center;
  @media (max-width: 1024px) {
    font-size: 30px;
  }
  @media (max-width: 650px) {
    font-size: 22px;
  }
`
const CardTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
`
const SubTitle = styled.div`
  font-size: 25px;
  font-weight: 500;
  @media (max-width: 1024px) {
    font-size: 14px;
  }
`
const InputLabel = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-left: 30px;
  @media (max-width: 1024px) {
    font-size: 12px;
    font-weight: 400;
    margin-left:20px;
  }
`
const RoyaltyLabel = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-left: 30px;
  @media (max-width: 1024px) {
    font-size: 12px;
    margin-left: 0;
    // margin-top: 30px;
  }
`
const Collections = styled.div`
  // background: linear-gradient(
  //   180deg,
  //   rgba(255, 255, 255, 0.06) 0%,
  //   rgba(255, 255, 255, 0.06) 100%
  // );
  // box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
  //   inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  // backdrop-filter: blur(30px);
  // border:1px solid rgba(255, 255, 255, 0.2);
  // background:rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  max-width: 1000px;
  padding: 50px;
  1px solid rgba(255, 255, 255, 0.2);
  // border-image-source: linear-gradient(
  //   106.01deg,
  //   rgba(255, 255, 255, 0.2) 1.02%,
  //   rgba(255, 255, 255, 0) 100%
  // );
  @media (max-width: 1200px) {
    width: 100% !important;
    padding: 30px;
  }
  
  @media (max-width: 480px) {
    width: 100% !important;
    padding: 15px;
  }
`
const SubText = styled.div`
  font-size: 18px;
  font-family: Mulish;
  @media (max-width: 1024px) {
    font-size: 14px;
    font-weight: 400;
  }
`
const StyledLink = styled.a`
  padding-top: 10px;
  font-size: 18px;
  font-family: Mulish;
  font-weight: 500;
  color: #cccccc;
  text-decoration: underline;
  @media (max-width: 1024px) {
    font-size: 14px;
    font-weight: 400;
  }
`

const StyledInput = styled.input`
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px 25px;
  font-size: 20px;
  font-family: Mulish;
  @media (max-width: 1024px) {
    font-size: 16px;
    padding:15px 20px;
  }
`
const IconWrapper = styled.div<{ width?: string; m?: string }>`
  background: rgba(225, 225, 225, 0.3);
  padding: 20px;
  display: flex;
  width: ${({ width }) => width || '100%'};
  height: 70px;
  border-radius: 20px;
  margin: ${({ m }) => m || '0'};
  align-items: center;
  justify-content: center;
  @media (max-width:576px){
    height:60px;
  }
`
