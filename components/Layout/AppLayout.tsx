import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { MobileFooterBar } from './MobileFooter'
import { useEffect, useState } from 'react'
import { isMobile } from 'util/device'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

//TagManager.initialize(tagManagerArgs)

export const AppLayout = ({
  footerBar = isMobile() ? <MobileFooterBar /> : <FooterBar />,
  children,
  fullWidth,
  hasBanner = false,
}) => {
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])
  return (
    <>
      <StyledWrapper>
        <NavigationSidebar openNav={openNav} setOpenNav={setOpenNav} />
        <div
          className={`main-section ${fullWidth ? 'fullWidth' : ''} ${
            hasBanner ? 'hasBanner' : ''
          }  w-100 ` }
        >
          <StyledContainer hasBanner={hasBanner}>
            <main>{children}</main>
          </StyledContainer>
        </div>
        <StyledFooter className="footer">
          <StyledFooterWrapper className="container">
            <StyledContainer>{footerBar}</StyledContainer>
          </StyledFooterWrapper>
        </StyledFooter>
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url('/images/background.jpg');
  background-repeat: no-repeat;
  position: relative;
  color: white;
  background-color: #191c2b;
`

const StyledContainer = styled.div<{ hasBanner: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledFooter = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  margin-top: 80px;
  flex-direction: column;
  justify-content: space-between;
`

const StyledFooterWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
