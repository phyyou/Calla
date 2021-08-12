import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSongInfo, ISongInfo } from "./api/song";
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  VStack,
  Text,
  Img,
  Heading,
} from "@chakra-ui/react";

export default function Home({ song }: { song: ISongInfo }) {
  return (
    <>
      <Head>
        <title>Calla</title>
        <meta name="description" content="Recommend Random Classical Music" />
        <link type="image/svg+xml" rel="icon" href="/Calla.svg" />
      </Head>

      <Container as={"main"}>
        <VStack marginTop={{ base: "28vh", md: "10vh" }}>
          <Img src={"/Calla.svg"} w={{ base: 16, md: 32 }}></Img>
          <Heading>Calla</Heading>
          <Text>랜덤으로 클래식 음악을 추천해줍니다.</Text>
          <audio controls={true} autoPlay={true} loop={true}>
            <source src={song.file}></source>
          </audio>
          <Table display={{ base: "none", md: "table" }} variant="simple">
            <TableCaption>곡 정보</TableCaption>
            <Thead>
              <Tr>
                {Object.keys(song.info).map((keyName, i) => (
                  <Th key={`key-${i}}`}>{keyName}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {Object.keys(song.info).map((keyName, i) => (
                  <Td key={`info-${i}`}>{song.info[keyName] as any}</Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </VStack>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const song = await getSongInfo();
  console.log(song);
  return { props: { song } };
};
