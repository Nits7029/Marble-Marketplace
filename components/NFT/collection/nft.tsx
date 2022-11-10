import { ChakraProvider, LinkBox } from '@chakra-ui/react'
import Link from 'next/link'
import { NftCollection } from 'services/nft'
import styled from 'styled-components'
import CollectionCard from './collection-card'
interface NftCollectionProps {
  readonly collections: NftCollection[]
}

export function NftCollectionTable({
  collections,
}: NftCollectionProps): JSX.Element {
  return (
    <ChakraProvider>
      <Container>
        {collections.map((collection, idx) => (
          <Link href={`/collection/${collection.id}`} passHref key={idx}>
            <LinkBox
              as="picture"
              transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
              _hover={{
                transform: 'scale(1.05)',
              }}
            >
              <CollectionCard key={idx} collection={collection} />
            </LinkBox>
          </Link>
        ))}
      </Container>
    </ChakraProvider>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 50px 30px;
  // padding: 20px;
  @media (max-width:1200px){
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding:0;
  }
  @media (max-width:640px){
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`
const CollectionDiv = styled.div`
  // border-radius: 20px;
  // box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  // border: 1px solid;
  // border-image-source: linear-gradient(
  //   90.65deg,
  //   #ffffff 0.82%,
  //   rgba(0, 0, 0, 0) 98.47%
  // );
  // background: linear-gradient(0deg, #050616, #050616) padding-box,
  //   linear-gradient(90.65deg, #ffffff 0.82%, rgba(0, 0, 0, 0) 98.47%) border-box;
  padding: 30px;
  height: 100%;
  cursor: pointer;
  @media (max-width: 1450px) {
    padding: 15px;
  }
  // @media (max-width: 480px) {
  //   width: 320px;
  // }
`

const ImgDiv = styled.div`
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
`

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
`
const Logo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  border:4px solid rgba(255, 255, 255, 0.13);
`
const Title = styled.div`
  font-size: 24px;
  overflow-wrap: anywhere;
  @media (max-width: 1450px) {
    font-size: 18px;
  }
`
