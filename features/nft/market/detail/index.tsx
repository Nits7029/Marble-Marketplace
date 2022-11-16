  import * as React from 'react'
  import Link from 'next/link'
  import { useCallback, useEffect, useState } from 'react'
  import { useRouter } from 'next/router'
  import { styled } from 'components/theme'
  import DateCountdown from 'components/DateCountdownMin'
  import { Button } from 'components/Button'
  import { IconWrapper } from 'components/IconWrapper'
  import { RoundedIcon, RoundedIconComponent } from 'components/RoundedIcon'
  import SimpleTable from './table'
  import PlaceBidModal from './components/PlaceBidModal'
  import UpdateMarketModal from './components/UpdateMarketModal'
  import OnSaleModal from './components/OnSaleModal'
  import TransferNFTModal from './components/TransferNFTModal'
  import BurnNFTModal from './components/BurnNFTModal'
  import MoreCollection from './components/Collection'
  import { Clock } from 'icons'
  import {
    ChakraProvider,
    Flex,
    Stack,
    Text,
    Grid,
    HStack,
    position,
  } from '@chakra-ui/react'
  import { toast } from 'react-toastify'
  import {
    failToast,
    getURLInfo,
    successToast,
    getErrorMessage,
  } from 'components/transactionTipPopUp'
  import Card from './components/card'
  import { useTokenInfoFromAddress } from 'hooks/useTokenInfo'
  import { getTokenBalance } from 'hooks/useTokenBalance'
  import { getTokenPrice } from 'hooks/useTokenDollarValue'
  import {
    nftViewFunction,
    MARKETPLACE_CONTRACT_NAME,
    NFT_CONTRACT_NAME,
    sendTransactionForMarketplace,
    executeMultipleTransactions,
    checkTransaction,
    marketplaceViewFunction,
    marketplaceFunctionCall,
    ONE_YOCTO_NEAR,
    Transaction,
    HERA_CONTRACT_NAME,
    TOKEN_DENOMS,
    nftFunctionCall,
  } from 'util/near'
  import { ftGetStorageBalance } from 'util/ft-contract'
  import { STORAGE_TO_REGISTER_WITH_FT } from 'util/creators/storage'
  import { getCurrentWallet } from 'util/sender-wallet'
  import {
    formatChakraDateToTimestamp,
    formatTimestampToDate,
    convertMicroDenomToDenom,
    formatNearToYocto,
    formatHera,
  } from 'util/conversion'
  import { NFTName, MoreTitle, RoyaltyContainer } from './styled'
  import { isMobile } from 'util/device'
  import { default_image } from 'util/constants'

  const DENOM_UNIT = {
    near: 24,
    'hera.cmdev0.testnet': 8,
  }
  interface MarketStatus {
    data?: any
    isOnMarket: boolean
    isStarted: boolean
    isEnded?: boolean
  }

  export const NFTDetail = ({ collectionId, id }) => {
    const [nft, setNft] = useState({
      image: '',
      name: '',
      collectionName: '',
      user: '',
      description: '',
      royalty: [],
      createdAt: '',
      collectionImage: '',
      creator: '',
    })
    const router = useRouter()
    const [isAuction, setIsAuction] = useState(false)
    const [isBidder, setIsBidder] = useState(false)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [token, setToken] = useState('near')
    const [price, setPrice] = useState('')
    const [reservePrice, setReservePrice] = useState('')
    const [startDate, setStartDate] = useState(Date.now())
    const [endDate, setEndDate] = useState(0)
    const [collectionInfo, setCollectionInfo] = useState<any>({})
    const [marketStatus, setMarketStatus] = useState<MarketStatus>({
      isOnMarket: false,
      isStarted: false,
    })
    const tokenInfo = useTokenInfoFromAddress(
      marketStatus.data && marketStatus.data.ft_token_id
    )
    const wallet = getCurrentWallet()
    const { txHash, pathname, errorType } = getURLInfo()
    useEffect(() => {
      const fetchData = async () => {
        const balance = await getTokenBalance(tokenInfo)
        setTokenBalance(balance)
      }
      fetchData()
    }, [tokenInfo])
    useEffect(() => {
      if (txHash && getCurrentWallet().wallet.isSignedIn()) {
        checkTransaction(txHash)
          .then((res: any) => {
            const transactionErrorType = getErrorMessage(res)
            const transaction = res.transaction
            return {
              isSuccess:
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'nft_approve' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'update_market_data' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'add_bid' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'buy' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'cancel_bid' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'delete_market_data' ||
                transaction?.actions[0]?.['FunctionCall']?.method_name ===
                  'accept_bid',
              transactionErrorType,
            }
          })
          .then(({ isSuccess, transactionErrorType }) => {
            if (isSuccess) {
              !transactionErrorType && !errorType && successToast(txHash)
              transactionErrorType && failToast(txHash, transactionErrorType)
            }
            router.push(pathname)
          })
      }
    }, [txHash])
    const loadNft = useCallback(async () => {
      try {
        if (collectionId === '[collection]') return false
        let data: any = {}
        let collection: any = {}
        try {
          ;[data, collection] = await Promise.all([
            nftViewFunction({
              methodName: 'nft_token',
              args: {
                token_id: `${collectionId}:${id}`,
              },
            }),
            nftViewFunction({
              methodName: 'nft_get_series_single',
              args: {
                token_series_id: `${collectionId}`,
              },
            }),
          ])
        } catch (err) {
          router.push('/404')
          return null
        }
        let res_collection: any = {}
        let res_nft: any = {}
        try {
          let ipfs_nft = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + data.metadata.reference
          )
          res_nft = await ipfs_nft.json()
        } catch (err) {
          res_nft = {}
        }
        try {
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + data.metadata.extra
          )
          res_collection = await ipfs_collection.json()
        } catch (err) {
          res_collection = {}
        }

        let collection_info: any = {}
        collection_info.id = collectionId
        collection_info.name = res_collection.name
        collection_info.description = res_collection.description
        collection_info.image = res_collection.featuredImage
          ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
          : default_image
        collection_info.banner_image = res_collection.logo
          ? process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
          : default_image
        collection_info.creator = collection.creator_id
        setCollectionInfo(collection_info)
        setNft({
          image: `${process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri}`,
          name: res_nft.name,
          user: data.owner_id,
          collectionName: res_collection.name,
          collectionImage: `${
            process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
          }`,
          description: res_nft.description,
          royalty: collection.royalty,
          createdAt:
            data.metadata.starts_at &&
            formatTimestampToDate(data.metadata.starts_at),
          creator: collection.creator_id,
        })
      } catch (err) {
        console.log('NFT Contract Error: ', err)
      }
    }, [collectionId, id])

    const getMarketData = async () => {
      try {
        const marketData = await marketplaceViewFunction({
          methodName: 'get_market_data',
          args: {
            nft_contract_id: NFT_CONTRACT_NAME,
            token_id: `${collectionId}:${id}`,
          },
        })
        // const date = formatTimestampToDate(marketData.)
        if (marketData.bids)
          marketData.bids.map((bid) => {
            if (bid.bidder_id === wallet.accountId) setIsBidder(true)
          })
        setMarketStatus({
          isOnMarket: true,
          data: {
            owner_id: marketData.owner_id,
            bids: marketData.bids,
            end_price: convertMicroDenomToDenom(
              marketData.end_price,
              TOKEN_DENOMS[marketData.ft_token_id]
            ).toFixed(2),
            ended_at: Number(marketData.ended_at) / 1000000 || 0,
            ft_token_id: marketData.ft_token_id,
            is_auction: marketData.is_auction,
            price: convertMicroDenomToDenom(
              marketData.price,
              TOKEN_DENOMS[marketData.ft_token_id]
            ).toFixed(2),
            started_at: Number(marketData.started_at) / 1000000 || 0,
            highest_bid: marketData.bids &&
              marketData.bids.length > 0 && {
                bidder_id: marketData.bids[marketData.bids.length - 1].bidder_id,
                price: convertMicroDenomToDenom(
                  marketData.bids[marketData.bids.length - 1].price,
                  DENOM_UNIT[marketData.ft_token_id]
                ).toFixed(2),
              },
            current_time: marketData.current_time,
            reserve_price: convertMicroDenomToDenom(
              marketData.reserve_price,
              TOKEN_DENOMS[marketData.ft_token_id]
            ).toFixed(2),
          },
          isStarted:
            marketData.current_time * 1000 >
            Number(marketData.started_at) / 1000000,
          isEnded:
            marketData.current_time * 1000 >
            Number(marketData.ended_at) / 1000000,
        })
      } catch (error) {
        console.log('Marketplace Error: ', error)
      }
    }
    useEffect(() => {
      loadNft()
      getMarketData()
    }, [collectionId, id])
    const handleClick = async () => {
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
      if (Number(price) <= 0) {
        toast.warning(`Please input your price.`, {
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
      if (isAuction && startDate >= endDate) {
        toast.warning(`Please select the correct date.`, {
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
      if (isAuction && Number(reservePrice) < Number(price)) {
        toast.warning(`Reserve price is more than starting price`, {
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
      const message = isAuction
        ? JSON.stringify({
            price:
              token === 'near' ? formatNearToYocto(price) : formatHera(price),
            ft_token_id: token,
            market_type: 'sale',
            is_auction: true,
            started_at: startDate.toString() + '000000',
            ended_at: endDate.toString() + '000000',
            reserve_price:
              (token === 'near'
                ? formatNearToYocto(reservePrice)
                : formatHera(reservePrice)) ||
              (token === 'near' ? formatNearToYocto(price) : formatHera(price)),
          })
        : JSON.stringify({
            price:
              token === 'near' ? formatNearToYocto(price) : formatHera(price),
            ft_token_id: token,
            market_type: 'sale',
            is_auction: false,
          })
      const params = {
        functionCalls: [
          {
            methodName: 'nft_approve',
            args: {
              token_id: `${collectionId}:${id}`,
              account_id: MARKETPLACE_CONTRACT_NAME,
              msg: message,
            },
            amount: '0.00044',
          },
        ],
        receiverId: NFT_CONTRACT_NAME,
      }
      await sendTransactionForMarketplace(params)
    }
    const handleTransfer = async (address) => {
      console.log('transferAddress: ', address)
      await nftFunctionCall({
        methodName: 'nft_transfer',
        args: {
          receiver_id: address,
          token_id: `${collectionId}:${id}`,
        },
        amount: ONE_YOCTO_NEAR,
      })
    }
    const handleAddBid = async () => {
      try {
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
        if (Number(price) <= 0) {
          toast.warning(`Please input your price.`, {
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
        if (
          Number(price) <
          (Number(marketStatus.data.highest_bid.price) * 1.05 ||
            Number(marketStatus.data.price))
        ) {
          toast.warning(`Price isn't acceptable.`, {
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

        if (Number(price) > tokenBalance) {
          toast.warning(`You don't have enough balance`, {
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
        if (marketStatus.data.is_auction)
          if (marketStatus.data.ft_token_id === 'near') {
            await marketplaceFunctionCall({
              methodName: 'add_bid',
              args: {
                nft_contract_id: NFT_CONTRACT_NAME,
                token_id: `${collectionId}:${id}`,
                ft_token_id: 'near',
                amount: formatNearToYocto(price),
              },
              amount: price,
            })
            return
          }
        const storageDepositForFT: Transaction = {
          receiverId: HERA_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'storage_deposit',
              args: {
                account_id: MARKETPLACE_CONTRACT_NAME,
              },
              amount: STORAGE_TO_REGISTER_WITH_FT,
            },
          ],
        }
        const ftTransferForAddBid: Transaction = {
          receiverId: HERA_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'ft_transfer_call',
              args: {
                receiver_id: MARKETPLACE_CONTRACT_NAME,
                amount: formatHera(price),
                msg: JSON.stringify({
                  nft_contract_id: NFT_CONTRACT_NAME,
                  ft_token_id: HERA_CONTRACT_NAME,
                  token_id: `${collectionId}:${id}`,
                  method: 'auction',
                }),
              },
              amount: ONE_YOCTO_NEAR,
            },
          ],
        }
        executeMultipleTransactions([storageDepositForFT, ftTransferForAddBid])
      } catch (error) {
        console.log('add - bid Error: ', error)
      }
    }
    const handleCancelClick = async () => {
      try {
        await marketplaceFunctionCall({
          methodName: 'cancel_bid',
          args: {
            nft_contract_id: NFT_CONTRACT_NAME,
            token_id: `${collectionId}:${id}`,
            account_id: wallet.accountId,
          },
          amount: ONE_YOCTO_NEAR,
        })
      } catch (error) {
        console.log('Cancel Bid Error: ', error)
      }
    }
    const handleCancelMarketing = async () => {
      try {
        const transactionForNFTRevoke: Transaction = {
          receiverId: NFT_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'nft_revoke',
              args: {
                account_id: wallet.accountId,
                token_id: `${collectionId}:${id}`,
              },
              amount: ONE_YOCTO_NEAR,
            },
          ],
        }
        const transactionForDeleteMarketData: Transaction = {
          receiverId: MARKETPLACE_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'delete_market_data',
              args: {
                nft_contract_id: NFT_CONTRACT_NAME,
                token_id: `${collectionId}:${id}`,
              },
              amount: ONE_YOCTO_NEAR,
            },
          ],
        }
        executeMultipleTransactions([
          transactionForDeleteMarketData,
          transactionForNFTRevoke,
        ])
      } catch (error) {
        console.log('Cancel Marketing Error: ', error)
      }
    }
    const handleAcceptBid = async () => {
      try {
        if (marketStatus.data.ft_token_id === 'near') {
          await marketplaceFunctionCall({
            methodName: 'accept_bid',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: `${collectionId}:${id}`,
            },
            amount: ONE_YOCTO_NEAR,
          })
          return
        }
        const royalties = Object.keys(nft.royalty)
        let transactionForRoyalty = []
        const storageDataForRoyalty = await Promise.all(
          royalties.map((royalty) => {
            return ftGetStorageBalance(HERA_CONTRACT_NAME, royalty)
          })
        )

        storageDataForRoyalty.forEach((element, index) => {
          const elementTransaction: Transaction = {
            receiverId: HERA_CONTRACT_NAME,
            functionCalls: [
              {
                methodName: 'storage_deposit',
                args: {
                  account_id: royalties[index],
                },
                amount: STORAGE_TO_REGISTER_WITH_FT,
              },
            ],
          }
          if (!element || element.total === '0') return
          transactionForRoyalty.push(elementTransaction)
        })
        const ownerStoragyRegistered = await ftGetStorageBalance(
          HERA_CONTRACT_NAME,
          wallet.accountId
        )
        let storageDepositForFT: Transaction
        if (!ownerStoragyRegistered || ownerStoragyRegistered.total === '0') {
          storageDepositForFT = {
            receiverId: HERA_CONTRACT_NAME,
            functionCalls: [
              {
                methodName: 'storage_deposit',
                args: {
                  account_id: wallet.accountId,
                },
                amount: STORAGE_TO_REGISTER_WITH_FT,
              },
            ],
          }
        }

        const acceptBidTransaction: Transaction = {
          receiverId: MARKETPLACE_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'accept_bid',
              args: {
                nft_contract_id: NFT_CONTRACT_NAME,
                token_id: `${collectionId}:${id}`,
              },
              amount: ONE_YOCTO_NEAR,
            },
          ],
        }
        if (storageDepositForFT) {
          executeMultipleTransactions([
            ...transactionForRoyalty,
            storageDepositForFT,
            acceptBidTransaction,
          ])
        } else
          executeMultipleTransactions([
            ...transactionForRoyalty,
            acceptBidTransaction,
          ])
      } catch (error) {
        console.log('Accept Bid Error: ', error)
      }
    }
    const handleUpdateData = async () => {
      try {
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
        if (Number(price) <= 0) {
          toast.warning(`Please input your price.`, {
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
        if (Number(reservePrice) < Number(price)) {
          toast.warning(`Reserve price must be bigger than start price`, {
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
        if (marketStatus.data.owner_id === wallet.accountId) {
          await marketplaceFunctionCall({
            methodName: 'update_market_data',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: `${collectionId}:${id}`,
              ft_token_id: marketStatus.data.ft_token_id,
              price:
                marketStatus.data.ft_token_id === 'near'
                  ? formatNearToYocto(price)
                  : formatHera(price),
              reserve_price:
                marketStatus.data.ft_token_id === 'near'
                  ? formatNearToYocto(reservePrice)
                  : formatHera(reservePrice),
            },
            amount: ONE_YOCTO_NEAR,
          })
          return
        }
      } catch (error) {
        console.log('update Error: ', error)
      }
    }
    const handleBurnNFT = async () => {
      try {
        await nftFunctionCall({
          methodName: 'nft_burn',
          args: {
            token_id: `${collectionId}:${id}`,
          },
          amount: ONE_YOCTO_NEAR,
        })
      } catch (error) {
        console.log('Cancel Bid Error: ', error)
      }
    }
    const handleBuy = async () => {
      try {
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
        if (Number(marketStatus.data.price) > tokenBalance) {
          toast.warning(`You don't have enough balance`, {
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
        if (marketStatus.data.ft_token_id === 'near') {
          await marketplaceFunctionCall({
            methodName: 'buy',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: `${collectionId}:${id}`,
              ft_token_id: 'near',
              amount: formatNearToYocto(Number(marketStatus.data.price)),
            },
            amount: marketStatus.data.price,
          })
          return
        }
        const royalties = Object.keys(nft.royalty)
        let transactionForRoyalty = []
        const storageDataForRoyalty = await Promise.all(
          royalties.map((royalty) => {
            return ftGetStorageBalance(HERA_CONTRACT_NAME, royalty)
          })
        )

        storageDataForRoyalty.forEach((element, index) => {
          const elementTransaction: Transaction = {
            receiverId: HERA_CONTRACT_NAME,
            functionCalls: [
              {
                methodName: 'storage_deposit',
                args: {
                  account_id: royalties[index],
                },
                amount: STORAGE_TO_REGISTER_WITH_FT,
              },
            ],
          }
          if (!element || element.total === '0')
            transactionForRoyalty.push(elementTransaction)
        })
        const ownerStoragyRegistered = await ftGetStorageBalance(
          HERA_CONTRACT_NAME,
          marketStatus.data.owner_id
        )
        let storageDepositForSeller: Transaction
        if (!ownerStoragyRegistered || ownerStoragyRegistered.total === '0') {
          storageDepositForSeller = {
            receiverId: HERA_CONTRACT_NAME,
            functionCalls: [
              {
                methodName: 'storage_deposit',
                args: {
                  account_id: marketStatus.data.owner_id,
                },
                amount: STORAGE_TO_REGISTER_WITH_FT,
              },
            ],
          }
        }

        const ftTransferForBuy: Transaction = {
          receiverId: HERA_CONTRACT_NAME,
          functionCalls: [
            {
              methodName: 'ft_transfer_call',
              args: {
                receiver_id: MARKETPLACE_CONTRACT_NAME,
                amount: formatHera(marketStatus.data.price),
                msg: JSON.stringify({
                  nft_contract_id: NFT_CONTRACT_NAME,
                  ft_token_id: HERA_CONTRACT_NAME,
                  token_id: `${collectionId}:${id}`,
                  method: 'buy',
                }),
              },
              amount: ONE_YOCTO_NEAR,
            },
          ],
        }
        if (storageDepositForSeller) {
          executeMultipleTransactions([
            ...transactionForRoyalty,
            storageDepositForSeller,
            ftTransferForBuy,
          ])
        } else
          executeMultipleTransactions([
            ...transactionForRoyalty,
            ftTransferForBuy,
          ])
        return
      } catch (error) {
        console.log('buy-update-bid Error: ', error)
      }
    }
    return (
      <ChakraProvider>
        <Stack>
          <Banner className='banner-image'>
            <BannerImage className="collection-banner" src={nft.collectionImage} alt="banner" />
            <NFTImageWrapper>
              <NFTImage src={nft.image} alt="nft-image" className='nft-image'/>
            </NFTImageWrapper>
          </Banner>
        </Stack>
        <Container>
          <NFTInfoWrapper>
            <NftInfoTag>
              <NFTName>{nft.name}</NFTName>
              <Stack className='nft-stack'
                display="flex"
                flexDirection='row'
                spacing={isMobile() ? 8 : 20}
              >
                <Stack spacing={3} className="mt-0 w-100">
                  <Text fontSize="14px" fontWeight="100">Collection</Text>
                  <Link href={`/collection/${collectionId}`} passHref>
                    <HStack style={{ cursor: 'pointer' }}>
                      <RoundedIcon size="26px" src={nft.collectionImage} />
                      <Text fontSize="14px" fontWeight="500" fontFamily="Mulish">
                        {nft.collectionName}
                      </Text>
                    </HStack>
                  </Link>
                </Stack>

                <Stack spacing={3} className="mt-0 w-50">
                  <Text fontSize="14px" fontWeight="100">Created By</Text>
                  <HStack>
                    {nft.creator && (
                      <RoundedIconComponent size="26px" address={nft.creator} />
                    )}
                  </HStack>
                </Stack>
                  
                <Stack spacing={3}  className="mt-0 w-50">
                  <Text fontSize="14px" fontWeight="100">Owned By</Text>
                  <HStack>
                    {nft.user && (
                      <RoundedIconComponent size="26px" address={nft.user} />
                    )}
                  </HStack>
                </Stack>
              </Stack>

              {isMobile() && (
                <NftInfoTag>
                 {marketStatus.isOnMarket ? (
                    <NftBuyOfferTag className="nft-buy-offer bg-border-linear">
                      {marketStatus.data.is_auction ? (
                        <>
                          {marketStatus.isStarted ? (
                            <NftSale>
                              <IconWrapper icon={<Clock />} />
                              {marketStatus.isEnded
                                ? 'Auction already ended '
                                : 'Auction ends in'}
                              {!marketStatus.isEnded && (
                                <Text>
                                  <DateCountdown
                                    dateTo={
                                      (marketStatus.data &&
                                        marketStatus.data.ended_at) ||
                                      Date.now()
                                    }
                                    dateFrom={
                                      (marketStatus.data &&
                                        marketStatus.data.current_time * 1000) ||
                                      Date.now()
                                    }
                                    interval={0}
                                    mostSignificantFigure="none"
                                    numberOfFigures={3}
                                    callback={() => {
                                      getMarketData()
                                    }}
                                  />
                                </Text>
                              )}
                              {/* {marketStatus.data.ended_at} */}
                            </NftSale>
                          ) : (
                            <NftSale>
                              <IconWrapper icon={<Clock />} />
                              Auction isn&apos;t started. It will start in
                              <Text>
                                <DateCountdown
                                  dateTo={
                                    marketStatus.data &&
                                    marketStatus.data.started_at
                                  }
                                  dateFrom={
                                    marketStatus.data &&
                                    marketStatus.data.current_time * 1000
                                  }
                                  interval={0}
                                  mostSignificantFigure="none"
                                  numberOfFigures={3}
                                  callback={() => {
                                    getMarketData()
                                  }}
                                />
                              </Text>
                            </NftSale>
                          )}
                        </>
                      ) : (
                        <NftSale>
                          For Sale
                          {/* {marketStatus.data.ended_at} */}
                        </NftSale>
                      )}
                      <PriceTag>
                        <Grid templateColumns="repeat(3, 1fr)" gap={6} margin="0" className="template-grid">
                          <Stack>
                            <Text color="rgb(112, 122, 131)" fontSize="14px">
                              {marketStatus.data.is_auction
                                ? 'Start price'
                                : 'Current price'}
                            </Text>
                            <Span className="owner-address">
                              {marketStatus.data.price}&nbsp;
                              {tokenInfo?.symbol}
                            </Span>
                          </Stack>
                          {marketStatus.data.is_auction &&
                            marketStatus.data.owner_id === wallet.accountId && (
                              <Stack>
                                <Text color="rgb(112, 122, 131)" fontSize="14px">
                                  Reserve Price
                                </Text>
                                <Span className="owner-address">
                                  {marketStatus.data.reserve_price}&nbsp;
                                  {tokenInfo?.symbol}
                                </Span>
                              </Stack>
                            )}
                          {marketStatus.data.is_auction && (
                            <Stack>
                              <Text color="rgb(112, 122, 131)" fontSize="14px">
                                Highest Bid
                              </Text>
                              {marketStatus.data.highest_bid && (
                                <Span className="owner-address">
                                  {marketStatus.data.highest_bid.price}&nbsp;
                                  {tokenInfo?.symbol}
                                </Span>
                              )}
                            </Stack>
                          )}
                        </Grid>
                        {marketStatus.isEnded &&
                          isBidder &&
                          marketStatus.data.highest_bid &&
                          Number(marketStatus.data.highest_bid.price) <
                            Number(marketStatus.data.reserve_price) && (
                            <Text
                              margin="10px 0"
                              fontFamily="Mulish"
                              fontSize="20px"
                            >
                              This auction ended but has not meet the reserve
                              price. The seller can evaluate and accept the
                              highest offer.
                            </Text>
                          )}
                        {marketStatus.data.owner_id === wallet.accountId ? (
                          <>
                            <ButtonGroup>
                              {!marketStatus.isEnded &&
                                !marketStatus.data.highest_bid && (
                                  <UpdateMarketModal
                                    tokenInfo={tokenInfo}
                                    onChange={(e) => {
                                      setPrice(e.target.value)
                                    }}
                                    onReserveChange={(e) =>
                                      setReservePrice(e.target.value)
                                    }
                                    nftInfo={{
                                      ft_token_id: marketStatus.data.ft_token_id,
                                      saleType: marketStatus.data.is_auction
                                        ? 'Auction'
                                        : 'Direct Sell',
                                      price: marketStatus.data.price,
                                      ended_at:
                                        marketStatus.data.ended_at * 1000000,
                                      current_time:
                                        marketStatus.data.current_time,
                                      image: nft.image,
                                      name: nft.name,
                                      hightest_bid:
                                        marketStatus.data.highest_bid.price,
                                      owner: nft.user,
                                    }}
                                    onHandle={handleUpdateData}
                                  />
                                )}
                              {(!marketStatus.data.highest_bid ||
                                (marketStatus.isEnded &&
                                  Number(marketStatus.data.highest_bid.price) <
                                    Number(marketStatus.data.reserve_price))) && (
                                <Button
                                  className="btn-buy btn-default"
                                  css={{
                                    background: '$white',
                                    color: '$black',
                                    stroke: '$black',
                                    width: '100%',
                                    padding: '15px auto',
                                  }}
                                  size="large"
                                  onClick={handleCancelMarketing}
                                >
                                  Cancel Marketing
                                </Button>
                              )}
                              {marketStatus.isEnded &&
                                marketStatus.data.is_auction &&
                                marketStatus.data.highest_bid && (
                                  <Button
                                    className="btn-buy btn-default"
                                    css={{
                                      background: '$white',
                                      color: '$black',
                                      stroke: '$white',
                                      width: '100%',
                                    }}
                                    variant="primary"
                                    size="large"
                                    onClick={handleAcceptBid}
                                  >
                                    Accept Bid
                                  </Button>
                                )}
                            </ButtonGroup>
                          </>
                        ) : marketStatus.data.is_auction ? (
                          <Stack
                            direction={isMobile() ? 'column' : 'row'}
                            alignItems="flex-end"
                          >
                            {marketStatus.isStarted && !marketStatus.isEnded && (
                              <Stack paddingTop={10} width="100%">
                                <PlaceBidModal
                                  tokenInfo={tokenInfo}
                                  tokenBalance={tokenBalance}
                                  onChange={(e) => {
                                    setPrice(e.target.value)
                                  }}
                                  price={price}
                                  onHandle={handleAddBid}
                                  nftInfo={{
                                    ft_token_id: marketStatus.data.ft_token_id,
                                    saleType: marketStatus.data.is_auction
                                      ? 'Auction'
                                      : 'Direct Sell',
                                    price: marketStatus.data.price,
                                    ended_at:
                                      marketStatus.data.ended_at * 1000000,
                                    current_time: marketStatus.data.current_time,
                                    image: nft.image,
                                    name: nft.name,
                                    hightest_bid:
                                      marketStatus.data.highest_bid.price,
                                    owner: nft.user,
                                  }}
                                />
                              </Stack>
                            )}
                            {isBidder && (
                              <Button
                                className="btn-buy btn-default"
                                css={{
                                  background: '$white',
                                  color: '$black',
                                  stroke: '$black',
                                  width: '100%',

                                }}
                                size="large"
                                onClick={handleCancelClick}
                              >
                                Cancel Bid
                              </Button>
                            )}
                          </Stack>
                        ) : (
                          <Button
                            className="btn-buy btn-default"
                            css={{
                              background: '$white',
                              color: '$black',
                              stroke: '$white',
                              width: '100%',
                            }}
                            size="large"
                            onClick={handleBuy}
                          >
                            Buy Now
                          </Button> 
                        )}
                      </PriceTag>
                    </NftBuyOfferTag>
                  ) : (
                    <NftBuyOfferTag className="nft-buy-offer bg-border-linear">
                      <Text className="nft-text"
                        fontSize="25px"
                        fontWeight="500"
                        fontFamily="Mulish"
                        textAlign="center"
                        paddingTop= {isMobile() ? '0' : '13px'}
                      >
                        {nft.user === wallet.accountId
                          ? 'Manage NFT'
                          : 'This is not for a sale'}
                      </Text>
                      {nft.user === wallet.accountId && (
                        <PriceTag>
                          <Stack
                            direction={isMobile() ? 'column' : 'row'}
                            spacing={4}
                            marginTop="20px"
                          >
                            <OnSaleModal
                              setIsAuction={setIsAuction}
                              isAuction={isAuction}
                              setToken={setToken}
                              token={token}
                              setStartDate={(e) => {
                                setStartDate(
                                  formatChakraDateToTimestamp(e.target.value)
                                )
                              }}
                              setEndDate={(e) => {
                                setEndDate(
                                  formatChakraDateToTimestamp(e.target.value)
                                )
                              }}
                              setReservePrice={(e) =>
                                setReservePrice(e.target.value)
                              }
                              setPrice={(e) => setPrice(e.target.value)}
                              onHandle={handleClick}
                              nftInfo={{
                                image: nft.image,
                                name: nft.name,
                                owner: nft.user,
                              }}
                            />
                            <TransferNFTModal
                              nftInfo={{
                                image: nft.image,
                                name: nft.name,
                                owner: nft.user,
                              }}
                              onHandle={handleTransfer}
                            />
                          </Stack>

                          <BurnNFTModal
                            nftInfo={{
                              ft_token_id:
                                marketStatus.data &&
                                marketStatus.data.ft_token_id,
                              saleType:
                                marketStatus.data && marketStatus.data.is_auction
                                  ? 'Auction'
                                  : 'Direct Sell',
                              price: marketStatus.data && marketStatus.data.price,
                              ended_at:
                                marketStatus.data &&
                                marketStatus.data.ended_at * 1000000,
                              current_time:
                                marketStatus.data &&
                                marketStatus.data.current_time,
                              image: nft.image,
                              name: nft.name,
                              hightest_bid:
                                marketStatus.data &&
                                marketStatus.data.highest_bid.price,
                              owner: nft.user,
                            }}
                            onHandle={handleBurnNFT}
                          />
                        </PriceTag>
                       )}
                    </NftBuyOfferTag>
                  )}
                </NftInfoTag>
              )}
              <Stack>
                <Text fontSize={isMobile() ? '24px' : '28px'} fontWeight="500" marginBottom="15px">
                  Royalty
                </Text>
                {Object.keys(nft.royalty).map((element, index) => (
                  <RoyaltyContainer key={index}>
                    <HStack>
                      <RoundedIconComponent size="26px" address={element} />
                    </HStack>
                    <Text textAlign="right" fontSize="13px">{nft.royalty[element] / 100} %</Text>
                  </RoyaltyContainer>
                ))} 
              </Stack>
              <Stack spacing={10}>
                <Card title="Description">
                  <Text fontSize="18px" fontWeight="400" fontFamily="Mulish">
                    {nft.description}
                  </Text>
                </Card>
                <Card title="Minted On">
                  <Text fontSize="16px" fontWeight="400" fontFamily="Mulish">
                    {nft.createdAt}
                  </Text>
                </Card>
                {isMobile() && marketStatus.data && marketStatus.data.bids && (
                  <Card title="Bid History">
                    <SimpleTable
                      data={marketStatus.data.bids}
                      unit={tokenInfo?.decimals}
                      paymentToken={tokenInfo?.symbol}
                    />
                  </Card>
                )}
              </Stack>
            </NftInfoTag>
            
            {!isMobile() && (
              <NftInfoTag>
                {marketStatus.isOnMarket ? (
                  <NftBuyOfferTag className="nft-buy-offer bg-border-linear">
                    {marketStatus.data.is_auction ? (
                      <>
                        {marketStatus.isStarted ? (
                          <NftSale>
                            <IconWrapper icon={<Clock />} />
                            {marketStatus.isEnded
                              ? 'Auction already ended'
                              : 'Auction ends in'}
                            {!marketStatus.isEnded && (
                              <Text>
                                <DateCountdown
                                  dateTo={
                                    (marketStatus.data &&
                                      marketStatus.data.ended_at) ||
                                    Date.now()
                                  }
                                  dateFrom={
                                    (marketStatus.data &&
                                      marketStatus.data.current_time * 1000) ||
                                    Date.now()
                                  }
                                  interval={0}
                                  mostSignificantFigure="none"
                                  numberOfFigures={3}
                                  callback={() => {
                                    getMarketData()
                                  }}
                                />
                              </Text>
                            )}
                            {marketStatus.data.ended_at}
                          </NftSale>
                        ) : (
                          <NftSale>
                            <IconWrapper icon={<Clock />} />
                            Auction isn&apos;t started. It will start in
                            <Text>
                              <DateCountdown
                                dateTo={
                                  marketStatus.data &&
                                  marketStatus.data.started_at
                                }
                                dateFrom={
                                  marketStatus.data &&
                                  marketStatus.data.current_time * 1000
                                }
                                interval={0}
                                mostSignificantFigure="none"
                                numberOfFigures={3}
                                callback={() => {
                                  getMarketData()
                                }}
                              />
                            </Text>
                          </NftSale>
                        )}
                      </>
                    ) : (
                      <NftSale>
                        For Sale
                        {/* {marketStatus.data.ended_at} */}
                      </NftSale>
                    )}
                    <PriceTag>
                      <Grid templateColumns="repeat(3, 1fr)" gap={6} className="template-grid">
                        <Stack direction="column">
                          <Text color="rgb(112, 122, 131)">Payment Token</Text>
                          <Flex>
                            <img
                              src={tokenInfo?.logoURI}
                              alt="token"
                              width="30px"
                            />
                            &nbsp;
                            <Span className="owner-address">
                              {tokenInfo?.name || 'Token'}
                            </Span>
                          </Flex>
                        </Stack>
                        <Stack direction="column">
                          <Text color="rgb(112, 122, 131)">
                            {tokenInfo?.name} Price
                          </Text>
                          <Flex>
                            <Span className="owner-address">
                              $ {getTokenPrice(tokenInfo?.name)}
                            </Span>
                          </Flex>
                        </Stack>
                        <Stack direction="column">
                          <Text color="rgb(112, 122, 131)">Balance</Text>
                          <Flex>
                            <Span className="owner-address">
                              {tokenBalance.toFixed(4)}&nbsp;{tokenInfo?.name}
                            </Span>
                          </Flex>
                        </Stack>
                      </Grid>
                      <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={6}
                        margin="20px 0 40px 0"
                      >
                        <Stack>
                          <Text color="rgb(112, 122, 131)">
                            {marketStatus.data.is_auction
                              ? 'Start price'
                              : 'Current price'}
                          </Text>
                          <Span className="owner-address">
                            {marketStatus.data.price}&nbsp;
                            {tokenInfo?.symbol}
                          </Span>
                        </Stack>
                        {marketStatus.data.is_auction &&
                          marketStatus.data.owner_id === wallet.accountId && (
                            <Stack>
                              <Text color="rgb(112, 122, 131)">
                                Reserve Price
                              </Text>
                              <Span className="owner-address">
                                {marketStatus.data.reserve_price}&nbsp;
                                {tokenInfo?.symbol}
                              </Span>
                            </Stack>
                          )}
                        {marketStatus.data.is_auction && (
                          <Stack>
                            <Text color="rgb(112, 122, 131)">Highest Bid</Text>
                            {marketStatus.data.highest_bid && (
                              <Span className="owner-address">
                                {marketStatus.data.highest_bid.price}&nbsp;
                                {tokenInfo?.symbol}
                              </Span>
                            )}
                          </Stack>
                        )}
                      </Grid>
                      {marketStatus.isEnded &&
                        isBidder &&
                        marketStatus.data.highest_bid &&
                        Number(marketStatus.data.highest_bid.price) <
                          Number(marketStatus.data.reserve_price) && (
                          <Text
                            margin="10px 0"
                            fontFamily="Mulish"
                            fontSize="20px"
                          >
                            This auction ended but has not meet the reserve price.
                            The seller can evaluate and accept the highest offer.
                          </Text>
                        )}
                      {marketStatus.data.owner_id === wallet.accountId ? (
                        <>
                          <ButtonGroup>
                            {!marketStatus.isEnded &&
                              !marketStatus.data.highest_bid && (
                                <UpdateMarketModal
                                  tokenInfo={tokenInfo}
                                  onChange={(e) => {
                                    setPrice(e.target.value)
                                  }}
                                  onReserveChange={(e) =>
                                    setReservePrice(e.target.value)
                                  }
                                  nftInfo={{
                                    ft_token_id: marketStatus.data.ft_token_id,
                                    saleType: marketStatus.data.is_auction
                                      ? 'Auction'
                                      : 'Direct Sell',
                                    price: marketStatus.data.price,
                                    ended_at:
                                      marketStatus.data.ended_at * 1000000,
                                    current_time: marketStatus.data.current_time,
                                    image: nft.image,
                                    name: nft.name,
                                    hightest_bid:
                                      marketStatus.data.highest_bid.price,
                                    owner: nft.user,
                                  }}
                                  onHandle={handleUpdateData}
                                />
                              )}
                            {(!marketStatus.data.highest_bid ||
                              (marketStatus.isEnded &&
                                Number(marketStatus.data.highest_bid.price) <
                                  Number(marketStatus.data.reserve_price))) && (
                              <Button
                                className="btn-buy btn-default"
                                css={{
                                  background: '$white',
                                  color: '$black',
                                  stroke: '$black',
                                  width: '100%',
                                }}
                                size="large"
                                onClick={handleCancelMarketing}
                              >
                                Cancel Marketing
                              </Button>
                            )}
                            {marketStatus.isEnded &&
                              marketStatus.data.is_auction &&
                              marketStatus.data.highest_bid && (
                                <Button
                                  className="btn-buy btn-default"
                                  css={{
                                    background: '$white',
                                    color: '$black',
                                    stroke: '$white',
                                    width: '100%',
                                  }}
                                  variant="primary"
                                  size="large"
                                  onClick={handleAcceptBid}
                                >
                                  Accept Bid
                                </Button>
                              )}
                          </ButtonGroup>
                        </>
                      ) : marketStatus.data.is_auction ? (
                        <Stack direction="row" alignItems="flex-end">
                          {marketStatus.isStarted && !marketStatus.isEnded && (
                            <Stack
                              paddingTop={10}
                              width={isMobile() ? '100%' : '50%'}
                            >
                              <PlaceBidModal
                                tokenInfo={tokenInfo}
                                tokenBalance={tokenBalance}
                                onChange={(e) => {
                                  setPrice(e.target.value)
                                }}
                                price={price}
                                onHandle={handleAddBid}
                                nftInfo={{
                                  ft_token_id: marketStatus.data.ft_token_id,
                                  saleType: marketStatus.data.is_auction
                                    ? 'Auction'
                                    : 'Direct Sell',
                                  price: marketStatus.data.price,
                                  ended_at: marketStatus.data.ended_at * 1000000,
                                  current_time: marketStatus.data.current_time,
                                  image: nft.image,
                                  name: nft.name,
                                  hightest_bid:
                                    marketStatus.data.highest_bid.price,
                                  owner: nft.user,
                                }}
                              />
                            </Stack>
                          )}
                          {isBidder && (
                            <Button
                              className="btn-buy btn-default"
                              css={{
                                background: '$white',
                                color: '$black',
                                stroke: '$black',
                                width: isMobile() ? '100%' : '50%',
                              }}
                              size="large"
                              onClick={handleCancelClick}
                            >
                              Cancel Bid
                            </Button>
                          )}
                        </Stack>
                      ) : (
                        <Button
                          className="btn-buy btn-default"
                          css={{
                            background: '$white',
                            color: '$black',
                            stroke: '$white',
                            width: '100%',
                          }}
                          size="large"
                          onClick={handleBuy}
                        >
                          Buy Now
                        </Button>
                      )}
                    </PriceTag>
                  </NftBuyOfferTag>
                ) : (
                  <NftBuyOfferTag className="nft-buy-offer bg-border-linear">
                    <Text
                      fontSize="25px"
                      fontWeight="500"
                      fontFamily="Mulish"
                      textAlign="center"
                      paddingTop="13px"
                      className='nft-text'
                    >
                      {/* {nft.user === wallet.accountId */}
                      {true
                        ? 'Manage NFT'
                        : 'This is not for a sale'}
                    </Text>
                    {/* {nft.user === wallet.accountId && ( */}
                    {true && (
                      <PriceTag>
                        <Stack direction="row" spacing={4} marginTop="20px">
                          <OnSaleModal
                            setIsAuction={setIsAuction}
                            isAuction={isAuction}
                            setToken={setToken}
                            token={token}
                            setStartDate={(e) => {
                              setStartDate(
                                formatChakraDateToTimestamp(e.target.value)
                              )
                            }}
                            setEndDate={(e) => {
                              setEndDate(
                                formatChakraDateToTimestamp(e.target.value)
                              )
                            }}
                            setReservePrice={(e) =>
                              setReservePrice(e.target.value)
                            }
                            setPrice={(e) => setPrice(e.target.value)}
                            onHandle={handleClick}
                            nftInfo={{
                              image: nft.image,
                              name: nft.name,
                              owner: nft.user,
                            }}
                          />
                          <TransferNFTModal
                            nftInfo={{
                              image: nft.image,
                              name: nft.name,
                              owner: nft.user,
                            }}
                            onHandle={handleTransfer}
                          />
                        </Stack>
                        <BurnNFTModal
                          nftInfo={{
                            ft_token_id:
                              marketStatus.data && marketStatus.data.ft_token_id,
                            saleType:
                              marketStatus.data && marketStatus.data.is_auction
                                ? 'Auction'
                                : 'Direct Sell',
                            price: marketStatus.data && marketStatus.data.price,
                            ended_at:
                              marketStatus.data &&
                              marketStatus.data.ended_at * 1000000,
                            current_time:
                              marketStatus.data && marketStatus.data.current_time,
                            image: nft.image,
                            name: nft.name,
                            hightest_bid:
                              marketStatus.data &&
                              marketStatus.data.highest_bid.price,
                            owner: nft.user,
                          }}
                          onHandle={handleBurnNFT}
                        />
                      </PriceTag>
                    )}
                  </NftBuyOfferTag>
                )}
                {marketStatus.data && marketStatus.data.bids && (
                // {true && (
                  <Card title="Bid History">
                    <SimpleTable
                      data={marketStatus.data.bids}
                      unit={tokenInfo?.decimals}
                      paymentToken={tokenInfo?.symbol}
                    />
                    {/* <p>hello</p> */}
                  </Card>
                )}
              </NftInfoTag>
            )}
          </NFTInfoWrapper>

          <Stack>
            <MoreTitle>More from this collection</MoreTitle>
            <MoreCollection info={collectionInfo} />
          </Stack>
        </Container>
      </ChakraProvider>
    )
  }
  const Container = styled('div', {
    padding: '170px 49px 0',
    '@media (max-width: 1024px)': {
      padding: '100px 20px 0',
    },
    '@media (max-width: 576px)': {
      padding: '50px 0 0',
    },

  })
  const NFTInfoWrapper = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '40px',
    '@media (max-width: 1024px)': {
      flexDirection: 'column',
      rowGap: '40px',
      display:'block',
    },
    '@media (max-width: 576px)': {
      padding:'50px 20px',
    },
  })

  const NftInfoTag = styled('div', {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '40px',

    '@media (max-width: 1024px)': {
      width: '100%',
      rowGap: '20px',
    },
  })

  const NftBuyOfferTag = styled('div', {
    borderRadius: '30px',
    height: '100%',
    marginBottom: '20px',

    '@media (max-width: 1024px)': {
      marginTop:'40px',
    },

    '@media (max-width: 576px)': {
      marginTop:'20px',
    },

    '@media (max-width: 480px)': {
      padding: '10px 0',
      background: 'rgba(5,6,21,0.2)',
      boxShadow:
        '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
    },
  })
  const NftSale = styled('div', {
    display: 'flex',
    padding: '30px 36px',
    alignItems: 'center',
    gap: '$4',
    borderBottom: '1px solid $borderColors$default',
    '&.disabled': {
      color: '$textColors$disabled',
    },


    '@media (max-width: 480px)': {
      padding: '15px 20px',
    },
  })
  const PriceTag = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    padding: '25px 25px 30px ',
    ' .price-lbl': {
      color: '$colors$link',
    },
  
    '@media (max-width: 480px)': {
      padding: '15px 20px',
    },
  })
  const ButtonGroup = styled('div', {
    display: 'flex',
    gap: '$8',
    marginTop: '$space$10',

    ' .btn-buy': {
      padding: '$space$10 $space$14',
      ' svg': {
        borderRadius: '2px',
      },
    },
    ' .btn-offer': {
      padding: '$space$10 $space$14',
      border: '$borderWidths$1 solid $black',
      color: '$black',
      '&:hover': {
        background: '$white',
        color: '$textColors$primary',
        stroke: '$white',
      },
      ' svg': {
        border: '$borderWidths$1 solid $black',
        borderRadius: '2px',
      },
    },

    '@media (max-width: 480px)': {
      display:'block',
    },
  })

  const Span = styled('span', {
    fontWeight: '600',
    fontSize: '20px',
    '@media (max-width: 480px)': {
      fontSize: '16px',
    },
  })

  const Banner = styled('div', {
    position: 'relative',
    width: '100%',
    display: 'block',
    paddingTop: '110px',

    '@media (max-width: 1024px)':{
      paddingTop: '65px',
    },

    '@media (max-width: 480px)':{
      height: '100%',
      paddingTop: '80px',
    },
  
  })
  const BannerImage = styled('img', {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    width: '100%',
    height: 'calc(100vh - 110px)',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: '-1',
    
    '@media (max-width: 1024px)': {
      height: 'calc(100vh - 263%)',
    },

    '@media (max-width: 576px)': {
      height: 'calc(100vh - 73%)',
    },
  })
  const NFTImageWrapper = styled('div', {
    position: 'relative',
    height: '676px',
    width: '676px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.06)',
    display: 'block',
    borderRadius: '30px',
    margin: '-28px auto',
    zIndex:'9',

    '@media (max-width: 1024px)': {
      height: '350px',
      width: '350px',
    },

    '@media (max-width: 480px)': {
      height: '430px',
      width: '340px',
    },
  })
  const NFTImage = styled('img', {
    position: 'absolute',
    top: '25px',
    left: '25px',
    bottom: '25px',
    right: '25px',
    width: 'calc(100% - 50px)',
    height: 'calc(100% - 50px)',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: '-1',
    borderRadius: '20px',
    '@media (max-width: 480px)': {
      top: '20px',
      left: '20px',
      bottom: '20px',
      right: '20px',
      width: 'calc(100% - 40px)',
      height: 'calc(100% - 40px)',
    },
  })
