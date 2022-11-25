import React from 'react'
import { AppLayout } from 'components/Layout/AppLayout'
import StakingComponent from 'features/staking'

export default function Staking() {
  return (
    <AppLayout fullWidth={true}>
      <StakingComponent />
    </AppLayout>
  )
}
