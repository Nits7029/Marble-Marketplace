import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  HStack,
  Stack,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { AppLayout } from 'components/Layout/AppLayout'
import { Button } from 'components/Button'
import { MyCollectedNFTs } from 'features/nft/market/profile'
import CreatedNFTs from 'features/nft/market/profile/creatednfts'
import { Email, DiscordT } from 'icons'
import {
  getProfileInfo,
  setImage,
  setProfileInfo,
  controlFollow,
} from 'hooks/useProfile'
import { default_image } from 'util/constants'
import { toast } from 'react-toastify'
import BannerImageUpload from 'components/BannerImageUpload'
import ProfilleLogoImageUpload from 'components/ProfileLogoImageUpload'
import EditProfileModal from 'features/profile/EditProfileModal'
import { getCurrentWallet } from 'util/sender-wallet'
import { getReducedAddress } from 'util/conversion'
import { isMobile } from 'util/device'

export default function Home() {
  const { asPath } = useRouter()
  const [profile, setProfile] = useState<any>({})
  const id = asPath && asPath.split('/')[2].split('?')[0]
  const wallet = getCurrentWallet()
  useEffect(() => {
    ;(async () => {
      const _profile = await getProfileInfo(id)
      setProfile(_profile)
    })()
  }, [id])
  const handleSetHash = async (e) => {
    const newProfile = await setImage({ id, ...e })
    setProfile(newProfile)
  }
  const handleProfileEdit = async (e) => {
    try {
      const new_profile = await setProfileInfo({ ...profile, ...e, id })
      setProfile(new_profile)
      toast.success(`Success`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return true
    } catch (err) {
      toast.warning(`Failed. Please try again.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return false
    }
  }
  const handleFollow = async () => {
    const new_profile = await controlFollow({
      id: wallet.accountId,
      target: id,
    })
    if (new_profile) {
      setProfile(new_profile)
    } else {
      toast.warning(`Failed. Please try again.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  return (
    <AppLayout fullWidth={true} hasBanner={true}>
      <Container>
        <Banner>
          {/* <BannerImage src={profile.banner || default_image} alt="banner" /> */}
          <BannerImageUpload
            hash={profile.banner}
            setHash={handleSetHash}
            isActive={wallet.accountId === id}
          />
        </Banner>
        <ProfileContainer>
          <ProfileInfo className="bg-border-linear profile-info-linear ">
            <LogoImage>
              <ProfilleLogoImageUpload
                isActive={wallet.accountId === id}
                hash={profile.avatar}
                setHash={handleSetHash}
              />
            </LogoImage>

            <Stack spacing="50px">
              <Stack spacing="50px">
                <h1>{profile.name || getReducedAddress(id)}</h1>
                <HStack justifyContent="space-around">
                  <Stack>
                    <h1>{profile.following && profile.following.length}</h1>
                    <p>Following</p>
                  </Stack>
                  <VerticalDivider />
                  <Stack>
                    <h1>{profile.followers && profile.followers.length}</h1>
                    <p>Followers</p>
                  </Stack>
                </HStack>
                {wallet.accountId !== id && wallet.accountId && (
                  <Button
                    className="btn-buy btn-default btn-follow"
                    css={{
                      background: '$white',
                      color: '$black',
                      stroke: '$black',
                      width: '100%',
                      fontWeight:'500',
                    }}
                    variant="primary"
                    size="large"
                    onClick={handleFollow}
                  >
                    {profile.followers && profile.followers.includes(id)
                      ? 'Unfollow'
                      : 'Follow'}
                  </Button>
                )}
              </Stack>
              <div className='follow-text'
                style={{
                  opacity: '0.5',
                  textAlign: 'center',
                  fontSize: isMobile() ? '16px' : '18px',
                  fontFamily: 'Mulish',
                }}
              >
                Not followed by anyone you follow
              </div>
              <Card className="bg-border-linear profile-bg-card" style={{
                marginTop:"40px",
                }}>
                <h3>Bio</h3>
                <p>{profile.bio || 'Undefined'}</p>
              </Card>
              {(profile.mail || profile.discord) && (
                <Card className="bg-border-linear profile-bg-card">
                  <h3>Links</h3>
                  <Stack spacing="5px" className="profile-link" style={{
                 display:'flex', flexDirection:'row'
                }}>
                    {profile.mail && (
                      <HStack className='w-50 icon-wrap'>
                        <Email /> &nbsp; <p>{profile.mail}</p>
                      </HStack>
                    )}
                    {profile.discord && (
                      <HStack className='w-50 icon-wrap'>
                        <DiscordT className='icon-size'/> &nbsp; <p>{profile.discord}</p>
                      </HStack>
                    )}
                  </Stack>
                </Card>
              )}
            </Stack>
            {wallet.accountId === id && (
              <IconButtonWrapper>
                <EditProfileModal
                  profileInfo={profile}
                  onHandleSave={handleProfileEdit}
                />
              </IconButtonWrapper>
            )}
          </ProfileInfo>

          <ProfileNFTInfo className="tab-profile">
            <Tabs>
              <StyledTabList>
                <StyledTab>{`Owned`}</StyledTab>
                <StyledTab>{`Created`}</StyledTab>
              </StyledTabList>
              <TabPanels>
                <TabPanel overflow="auto">
                  <MyCollectedNFTs id={id} />
                </TabPanel>
                <TabPanel overflow="auto">
                  <CreatedNFTs id={id} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ProfileNFTInfo>
        </ProfileContainer>
      </Container>
    </AppLayout>
  )
}

const Container = styled.div`
`

const Banner = styled.div`
  position: relative;
  min-height: 543px;
  width: 100%;
  display: block;
  z-index: 10;
  @media (max-width: 1024px) {
    height: 216px;
    min-height:273px;
  }
`
const LogoImage = styled.div`
  width: 282px;
  height: 282px;
  border-radius: 50%;
  border: 7px solid #ffffff;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 50%;
  transform: translate(-50% , -50%);

  @media (max-width: 1024px) {
    width: 182px;
    height: 182px;
    top: -10px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    top: -60px;
    left: 50%;
    border: 3px solid #ffffff;
    transform:translate(-50%);
  }
`
const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 0px 49px 0px;
  p {
    font-size: 18px;
    font-weight: 400;
    font-family: Mulish;
    @media (max-width:576px){
      font-size: 15px !important;
    }
  }
  h3 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  h2 {
    font-size: 22px;
    font-weight: 600;
  }
  h1 {
    font-size: 40px;
    font-weight: 600;
    text-align: center;
  }
  @media (max-width: 1024px) {
    padding:0px 0;
    display:block !important;
  }
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    h1 {
      font-size: 24px;
    }
    p {
      font-size: 20px;
    }
    h3 {
      font-size: 16px;
    }
  }
`
const ProfileInfo = styled.div`
  padding: 180px 50px 50px 50px;
  width:640px;
  border-radius: 0 !important;
  height: fit-content;
  position: relative;
  @media (max-width: 1024px) {
    padding: 80px 25px 25px 25px;
    max-width:90% !important;
    margin:0 auto;
  }

`
const VerticalDivider = styled.div`
  border: 1px solid #5f5858;
  transform: rotate(90deg);
  width: 90px;
  height: 0px;
`
const Card = styled.div`
  border-radius: 20px;
  padding: 20px 25px;
  @media (max-width: 480px) {
    p {
      font-size: 14px;
    }
  }
`
const ProfileNFTInfo = styled.div`
  @media (max-width: 480px) {
    padding: 10px 0px;
  }
`
const StyledTabList = styled(TabList)`
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.1);
  font-weight: 400;
  margin: 0px !important;
  [aria-selected='true'] {
    border-color: #ffffff !important;
    border-bottom: 2px solid;
    font-weight: 400;
    color: white;
  }
`

const StyledTab = styled(Tab)`
  font-size: 22px;
  font-weight: 300;
  padding: 20px 70px 20px 10px;
  &:last-child {
    padding: 20px 70px 20px 70px;
  }
  @media (max-width: 480px) {
    font-size: 15px;
    padding: 10px 35px 10px 0px;
  }
`
const IconButtonWrapper = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
`
