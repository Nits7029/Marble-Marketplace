import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../Button'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { getTokenBalance } from 'hooks/useTokenBalance'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useRouter } from 'next/router'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { getProfileData } from 'store/actions/profileAction'
import { IconWrapper } from '../IconWrapper'
import { isMobile } from 'util/device'
import { Nav, RoundedLeft, Setting, Help, Disconnect } from '../../icons'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { getReducedAddress } from 'util/conversion'
import { RoundedIcon, RoundedIconComponent } from 'components/RoundedIcon'
import { styled } from '../theme'
import { __TEST_MODE__ } from '../../util/constants'
import { default_image } from '../../util/constants'
import {
  StyledWrapper,
  StyledListForLinks,
  StyledLink,
  StyledDivForLogo,
  CreateButton,
  StyledMenuItem,
} from './styled'

export function NavigationSidebar({ openNav, setOpenNav }) {
  const [accountId, setAccountId] = useState('')
  const profile = useSelector((state: any) => state.profileData.profile_status)
  const { connectWallet, disconnectWallet, setAccount } = useConnectWallet()
  const ref = useRef(null)
  const { pathname, push } = useRouter()
  const [balance, setBalance] = useState(0)
  const baseToken = useBaseTokenInfo()
  const dispatch = useDispatch()
  useEffect(() => {
    // setBalance(0)
    getTokenBalance(baseToken).then((balance) => {
      setBalance(balance)
    })
  }, [baseToken])
  useEffect(() => {
    setAccount().then((id) => {
      setAccountId(id)
    })
  }, [setAccount])
  useEffect(() => {
    getProfileData(accountId, dispatch)
  }, [accountId, dispatch])

  const disconnect = async () => {
    await disconnectWallet()
    push('/')
    setAccountId('')
  }
  function useOutsideClick(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenNav(false)
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const isActive = (path) => (pathname === path ? 'active' : '')
  useOutsideClick(ref)
  return (
    <>
      {isMobile() ? (
        <MobileWrapper>
          <IconWrapper
            className="mobile-nav"
            type="button"
            size="40px"
            icon={<Nav />}
            onClick={() => {
              setOpenNav(!openNav)
            }}
          />
          <Flex>
            <Link href="/" passHref>
              <StyledDivForLogo as="a">
                <img className="logo-img" src="/images/logotext.svg" alt="logo" />
              </StyledDivForLogo>
            </Link>
            {accountId ? (
              <Link href="/create" passHref>
                <CreateButton>Create</CreateButton>
              </Link>
            ) : (
              <ConnectedWalletButton
                connected={!!accountId}
                walletName={accountId}
                onConnect={() => connectWallet()}
                onDisconnect={() => disconnect()}
              />
            )}
            {openNav && (
              <MobileMenu ref={ref}>
                <MobileMenuWrapper>
                  <Link href="/" passHref>
                    <StyledDivForLogo as="a">
                      <img
                        className="logo-img"
                        src="/images/logotext.svg"
                        alt="logo"
                      />
                    </StyledDivForLogo>
                  </Link>
                  {accountId && (
                    <MobileProfileInfo>
                      <RoundedIconComponent
                        size="48px"
                        address={accountId}
                        direction="column"
                        font="14px"
                      />
                      <MobileWalletInfo>
                        <p>Wallet Balance</p>
                        <h2>{balance.toFixed(2)} Near</h2>
                        <AddressWrapper>
                          <p>{getReducedAddress(accountId)}</p>&nbsp;
                          <GreenRound />
                        </AddressWrapper>
                      </MobileWalletInfo>
                    </MobileProfileInfo>
                  )}
                  <MobileLinkWrapper>
                    <StyledLink>
                      <Link
                        href="https://app.marbledao.finance/dashboard"
                        passHref
                      >
                        <a className="dropdown-item">
                          <span>Feed</span>
                        </a>
                      </Link>
                    </StyledLink>
                    <StyledLink>
                      <Link href="/explore" passHref>
                        <a className="dropdown-item">
                          <span className={isActive('/explore')}>Browse</span>
                        </a>
                      </Link>
                    </StyledLink>
                    <StyledLink>
                      <Link href="/explore" passHref>
                        <a className="dropdown-item">
                          <span className={isActive('/defi')}>DeFi</span>
                        </a>
                      </Link>
                    </StyledLink>
                    <HorizontalDivider />
                    <StyledLink>
                      <Setting />
                      &nbsp; Setting(soon)
                    </StyledLink>
                    <StyledLink>
                      <Help />
                      &nbsp; Help(soon)
                    </StyledLink>
                  </MobileLinkWrapper>
                  <ConnectedWalletButton
                    connected={!!accountId}
                    walletName={accountId}
                    onConnect={() => connectWallet()}
                    onDisconnect={() => disconnect()}
                  />
                </MobileMenuWrapper>
              </MobileMenu>
            )}
          </Flex>
        </MobileWrapper>
      ) : (
        <StyledWrapper className={`wrap-header ${openNav ? 'open' : ''}`}>
          <StyledMenuContainer className="wrap-menu container">
            <StyledListForLinks className="top-menu-links">
              <Link href="/" passHref>
                <StyledDivForLogo as="a">
                  <img
                    className="logo-img"
                    src="/images/logotext.svg"
                    alt="logo"
                  />
                </StyledDivForLogo>
              </Link>
              <VerticalDivider />
              <StyledLink>
                <Link href="https://app.marbledao.finance/dashboard" passHref>
                  <a className="dropdown-item">
                    <span>Feed</span>
                  </a>
                </Link>
              </StyledLink>
              <StyledLink>
                <Link href="/explore" passHref>
                  <a className="dropdown-item">
                    <span className={isActive('/explore')}>Browse</span>
                  </a>
                </Link>
              </StyledLink>
              <StyledLink>
                <a
                  className="dropdown-item"
                  href="https://near.marbledao.finance/"
                  target="__blank"
                >
                  <span className={isActive('/defi')}>DeFi</span>
                </a>
              </StyledLink>
              {accountId && (
                <StyledLink>
                  <Link href="/staking" passHref>
                    <a className="dropdown-item">
                      <span className={isActive('/staking')}>Staking</span>
                    </a>
                  </Link>
                </StyledLink>
              )}
            </StyledListForLinks>
            <ButtonField className='header-btn'>
              {accountId ? (
                <Menu>
                  <MenuButton
                    borderRadius="50%"
                    border="3px solid rgba(255, 255, 255, 0.2)"
                  >
                    <RoundedIcon
                      size="36px"
                      src={
                        profile.avatar
                          ? process.env.NEXT_PUBLIC_PINATA_URL + profile.avatar
                          : default_image
                      }
                    />
                  </MenuButton>
                  <StyledMenuList>
                    <Link href={`/profile/${accountId}`} passHref>
                      <ProfileMenuItem>
                        <Flex>
                          <RoundedIconComponent
                            size="58px"
                            address={accountId}
                          />
                        </Flex>
                        <RoundedLeft />
                      </ProfileMenuItem>
                    </Link>
                    <StyledMenuItem>
                      <VFlex>
                        <p>Wallet Balance</p>
                        <h1>{balance.toFixed(2)} Near</h1>
                      </VFlex>
                      <AddressWrapper>
                        <p>{getReducedAddress(accountId)}</p>&nbsp;
                        <GreenRound />
                      </AddressWrapper>
                    </StyledMenuItem>
                    <StyledMenuItem>
                      <Flex>
                        <Setting />
                        &nbsp; Setting(soon)
                      </Flex>
                      <RoundedLeft />
                    </StyledMenuItem>
                    <StyledMenuItem>
                      <Flex>
                        <Help />
                        &nbsp; Help(soon)
                      </Flex>
                      <RoundedLeft />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => disconnect()}>
                      <Flex>
                        <Disconnect />
                        &nbsp; Disconnect
                      </Flex>
                      <RoundedLeft />
                    </StyledMenuItem>
                  </StyledMenuList>
                </Menu>
              ) : (
                <ConnectedWalletButton
                  connected={!!accountId}
                  walletName={accountId}
                  onConnect={() => connectWallet()}
                  onDisconnect={() => disconnect()}
                />
              )}
              {accountId && (
                <Link href="/create" passHref>
                  <CreateButton>Create</CreateButton>
                </Link>
              )}
            </ButtonField>
          </StyledMenuContainer>
        </StyledWrapper>
      )}
    </>
  )
}

const GreenRound = styled('div', {
  width: '12px',
  height: '12px',
  background: '#24BE74',
  borderRadius: '50%',
})
const AddressWrapper = styled('div', {
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.37) 100%)',
  boxShadow:
    '0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4)',
  backdropFilter: 'blur(30px)',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.2)',
  display: 'flex',
  ' p': {
    fontSize: '14px',
  },
  padding: '10px',
  alignItems: 'center',
})
const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  ' p': {
    fontSize: '22px',
   
  },
})
const VFlex = styled('div', {
  ' p': {
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Mulish',
  },
  ' h1': {
    fontSize: '20px',
    fontWeight: '700',
  },
})

const StyledMenuList = styled(MenuList, {
  boxShadow:
    '0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4)',
  background:
    'linear-gradient(0deg, rgba(5, 6, 22, 0.2), rgba(5, 6, 22, 0.2)) padding-box, linear-gradient(90.65deg,rgba(255, 255, 255, 0.2) 0.82%,rgba(0, 0, 0, 0) 98.47%)border-box',
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '20px',
  width: '400px',
  backdropFilter: 'blur(30px)',
})
const ProfileMenuItem = styled('div', {
  backDropFilter: 'blur(40px)',
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
})

const StyledMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: '$2',
  padding: '0 0',
  width: '100%',
  ' a': {
    color: '$colors$white',
    display: 'flex',
    ' svg': {
      color: '$colors$white',
      stroke: '$colors$white',
    },
  },
})

const ButtonField = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const VerticalDivider = styled('div', {
  width: '1px',
  height: '80%',
  border: '1px solid #363B4E',
  margin: '0 10px',
})
const HorizontalDivider = styled('div', {
  height: '1px',
  width: '100%',
  background: '#363B4E',
})
const MobileMenu = styled(`div`, {
  position: 'fixed',
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, #000000 100%)',
  boxShadow:
    '0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4)',
  backdropFilter: 'blur(30px)',
  left: 0,
  top: 0,
  overflow: 'auto',
  height: '100vh',
  width: '80vw',
})

const MobileMenuWrapper = styled('div', {
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '36px',
})
const MobileWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px',
  alignItems: 'center',
  zIndex: '2',
  background: 'rgba(8,12,28,0,6)',
})
const MobileProfileInfo = styled('div', {
  background: 'rgba(5,6,21,0.2)',
  boxShadow: '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
  backdropFilter: 'blur(40px)',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px',
  width: '100%',
})
const MobileWalletInfo = styled('div', {
  '& p': {
    fontSize: '12px',
  },
  '& h2': {
    fontFamily: 'Trajan',
    fontSize: '16px',
  },
})

const MobileLinkWrapper = styled('div', {
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '36px',
})
