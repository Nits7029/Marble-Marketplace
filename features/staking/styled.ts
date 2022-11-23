import styled from 'styled-components'
import { GradientBackground } from 'styles/styles'

export const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  min-height:calc(100vh - 80px);
  height:100%;
`
export const Header = styled.div`
  font-size: 50px;
  font-weight: 600;
  margin-bottom:30px;
`
export const  StakingCardWrapper = styled(GradientBackground)`
  padding: 40px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  min-height: 622px;
  height:100%;
`
export const CollectionCardWrapper = styled.div``

export const CollectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-left: 70px;
  width: 100%;
  h1 {
    font-size: 42px;
    font-weight: 600;
  }
`

export const StakingInfoContainer = styled.div`
  row-gap: 20px;
  display:flex;
  flex-wrap:wrap;
`
export const InfoContent = styled.div`
max-width:50%;
flex-basis: 50%;
  h2 {
    font-size: 28px;
    font-weight: 500;
  }
  h3 {
    font-size: 26px;
    font-weight: 500;
    opacity: 0.5;
    margin-top:10px;
  }
`

export const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 50px;
`

export const OwnedNftsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  width: 100%;
  margin-top: 50px;
`
export const CountDownWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
`
