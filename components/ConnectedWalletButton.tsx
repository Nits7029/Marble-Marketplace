import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { getTokenBalance } from '../hooks/useTokenBalance'
import { CSS } from '@stitches/react'

type ConnectedWalletButtonProps = { css?: CSS } & {
  walletName?: string
  onConnect: () => void
  onDisconnect: () => void
  connected: boolean
}

export const ConnectedWalletButton = ({
  onConnect,
  connected,
  onDisconnect,
  walletName,
  ...props
}: ConnectedWalletButtonProps) => {
  const baseToken = useBaseTokenInfo()
  const [openWallet, setOpenWallet] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // setBalance(0)
    getTokenBalance(baseToken).then((balance) => {
      setBalance(balance)
    })
  }, [baseToken])

  if (!connected) {
    return (
      <ConnectWalletContainer onClick={onConnect}>
        Connect Wallet
      </ConnectWalletContainer>
    )
  }
  return (
    <ConnectWalletContainer onClick={onDisconnect}>
      Disconnect
    </ConnectWalletContainer>
  )
}

const ConnectWalletContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
    inset 0px 7px 8px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  cursor: pointer;
  color: black;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  padding: 14px 34px;
  white-space: nowrap;
  margin-left:auto;
  height: 57px;
  @media (max-width: 1550px) {
    height: 37px;
    width: 150px;
    border-radius: 10px;
    font-size: 12px;
    
  }
  @media (max-width: 650px) {
    height: 48px;
    margin-left: 0;
  }
`
