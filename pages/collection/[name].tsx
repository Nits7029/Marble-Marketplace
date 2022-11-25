import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { AppLayout } from 'components/Layout/AppLayout'
import { styled, theme } from 'components/theme'
import { Collection } from 'features/nft/market/collection'

import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/reducers'
import { FILTER_STATUS, NFT_COLUMN_COUNT } from 'store/types'

export default function Home() {
  const DEFAULT_NFT_COLUMN_COUNT = 4

  const router = useRouter()
  const { asPath, pathname } = useRouter()
  const collectionId = asPath.replace('/collection/', '').split('?')[0]

  const [fullWidth, setFullWidth] = useState(true)
  const [tabIndex, setTabIndex] = React.useState(0)

  const borderColor = theme.borderColors.default
  const dispatch = useDispatch()

  const filterData = useSelector((state: State) => state.filterData)
  const { filter_status } = filterData

  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  useEffect(() => {
    ;(async () => {
      if (collectionId === undefined || collectionId == '[name]') return false
    })()
  }, [collectionId])
  return (
    <AppLayout fullWidth={fullWidth} hasBanner={true}>
      <Collection id={collectionId} />
    </AppLayout>
  )
}

const Container = styled('div', {})
