import styled from 'styled-components'
import { GradientBackground, SecondGradientBackground } from 'styles/styles'
import { Button } from 'components/Button'

export const Container = styled.div`
  max-width: 1000px;
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
  font-weight: 700;
  padding-bottom: 20px;
  @media (max-width: 1550px) {
    font-size: 40px;
    font-weight: 500;
    margin-top: 20px;
  }
`
export const StakingCardWrapper = styled(SecondGradientBackground)`
  &:before {
    border-radius: 20px;
    opacity: 0.5;
  }
  padding: 40px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  @media (max-width: 1550px) {
    padding: 20px;
  }
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    padding: 10px;
  }
`
export const CollectionCardWrapper = styled.div``

export const CollectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  flex-direction: column;
  width: 100%;
  h1 {
    font-size: 42px;
    font-weight: 500;
  }
  @media (max-width: 1550px) {
    h1 {
      font-size: 36px;
    }
  }
  @media (max-width: 1024px) {
    text-align: center;
    padding-left: 0;
  }
`

export const StakingInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 30px;
  @media (max-width: 650px) {
    display: flex;
    flex-direction: column;
  }
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
  @media (max-width: 1550px) {
    h2 {
      font-size: 20px;
    }
    h3 {
      font-size: 16px;
    }
  }
  @media (max-width: 650px) {
    display: flex;
    justify-content: space-between;
    h2 {
      font-size: 18px;
    }
    h3 {
      font-size: 15px;
    }
  }
`

export const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 50px;
  @media (max-width: 650px) {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    padding-top: 50px;
  }
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
export const StyledButton = styled(Button)`
  background: white;
  color: black;
  stroke: black;
  padding: 10px;
  font-weight: 500;

  @media (max-width: 1550px) {
    height: 56px;
    font-size: 15px;
  }
`
