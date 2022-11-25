import { ChakraProvider } from '@chakra-ui/react'
import { AppLayout } from 'components/Layout/AppLayout'
import Profiles from 'features/nft/market/profile/allprofiles'
import useExplorer from 'hooks/useExplorer'
import Link from 'next/link'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
// import { getTotalPools } from 'util/pool'

export default function Explores() {
  const { countInfo } = useSelector((state: any) => state.uiData)

  return (
    <ChakraProvider>
      <AppLayout fullWidth={true}>
        <StyledTabList>
          <Link href="/explore/nfts" passHref>
            <StyledTab>{`NFTs(${countInfo.nft})`}</StyledTab>
          </Link>
          <Link href="/explore/collections" passHref>
            <StyledTab>{`Collections(${countInfo.collection})`}</StyledTab>
          </Link>
          <Link href="/explore/profiles" passHref>
            <StyledTab
              isActive={true}
            >{`Profiles(${countInfo.profile.profiles})`}</StyledTab>
          </Link>
        </StyledTabList>
        <Profiles profileCounts={countInfo.profile} />
      </AppLayout>
    </ChakraProvider>
  )
}
const StyledTabList = styled.div`
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-weight: 400;
  display: flex;
  overflow: auto;
  width: fit-content;
  @media (max-width: 800px) {
    width: auto;
  }
`

const StyledTab = styled.div<{ isActive: boolean }>`
  font-size: 22px;
  font-weight: 400;
  padding: 20px;
  margin: 0 20px;
  cursor: pointer;
  ${({ isActive }) => isActive && 'border-bottom: 2px solid'};
  @media (max-width: 1550px) {
    font-size: 18px;
    margin: 0 15px;
    padding: 15px;
  }
`
