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
  Box,
  TableCaption,
  VStack,
  Text,
  Img,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
          <Box textAlign={"center"}>
            제목: {song.info["Work Title\n"]}
            <br />
            작곡가: {song.info["Composer\n"]}
          </Box>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    곡 상세정보
                    <br />
                    (주의: 커서 한눈에 보지 못함)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Table variant="simple">
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
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
