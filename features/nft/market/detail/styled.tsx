import styled from 'styled-components'
import { SecondGradientBackground } from 'styles/styles'

export const NFTName = styled.div`
  font-size: 60px;
  font-weight: 600;
  line-height: 75px;
  margin-top:20px;
  @media (max-width: 1550px) {
    font-size: 45px;
  }
  @media (max-width: 650px) {
    font-size: 24px;
    line-height:50px;
  }
`
export const MoreTitle = styled.div`
  font-size: 46px;
  font-weight: 500;
  // margin-top: -53px;
  margin:30px 0 35px;
  @media (max-width: 1550px) {
    font-size: 30px;
  }
  @media (max-width: 650px) {
    font-size: 24px;
    margin:30px 0 20px;

  }
  @media (max-width: 576px) {
    margin:30px 10px 20px;
  }
`

export const RoyaltyContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  @media (max-width: 650px) {
    justify-content: space-between;
  }
`

export const NftBuyOfferTag = styled(SecondGradientBackground)`
  padding: 20px;
  &:before {
    border-radius: 30px;
    opacity: 0.3;
  }
  height: 100%;
  margin-bottom: 20px;
  @media (max-width: 650px) {
    padding: 10px 0;
    &:before {
      border-radius: 10px;
    }
  }
`

export const CountDownText = styled.div`
  @media (max-width: 650px) {
    span {
      font-size: 15px !important;
      width: fit-content;
    }
  }
`
