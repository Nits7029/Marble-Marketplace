import React from 'react'
import styled from 'styled-components'
import { SecondGradientBackground } from 'styles/styles'

const Card = ({ title, children }) => {
  return (
    <Container className="bg-border-linear">
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Container>
  )
}

const Container = styled(SecondGradientBackground)`
  padding: 30px;
  width: 100%;
  &:before {
    border-radius: 30px;
    opacity: 0.3;
  }
  @media (max-width: 650px) {
    padding: 15px 20px;
    margin-top:20px !important;
  }
`
const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  @media (max-width: 650px) {
    font-size: 16px;
    margin-bottom:10px;
  }
`

const Content = styled.div`
  // padding: 10px 0 0 0;

`
export default Card
