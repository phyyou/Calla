import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";

import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  VStack,
  Text,
  Img,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
} from "@chakra-ui/react";

import { ISongInfo } from "../lib/types/song";
import { getSongInfo, useSong } from "../lib/hooks/useSong";
import { RepeatIcon } from "@chakra-ui/icons";

export default function Home({ initialData }: { initialData: ISongInfo }) {
  const { song, isError, isLoading, mutate } = useSong(initialData);
  const toast = useToast();

  useEffect(() => {}, [isError]);
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
          {!isLoading && !isError ? (
            <audio key={song.file} controls={true} autoPlay={true} loop={true}>
              <source src={song?.file}></source>
            </audio>
          ) : null}
          <Box textAlign={"center"}>
            제목:{" "}
            {!isLoading && !isError && typeof song?.info !== "undefined"
              ? song?.info["Work Title\n"]
              : null}
            <br />
            작곡가:{" "}
            {!isLoading && !isError && typeof song?.info !== "undefined"
              ? song?.info["Composer\n"]
              : null}
          </Box>
          <Button
            leftIcon={<RepeatIcon />}
            isLoading={
              isLoading || isError || typeof song?.info === "undefined"
            }
            isDisabled={isLoading}
            loadingText="새로운 곡을 가져오는 중 입니다"
            onClick={() => {
              mutate("/api/song");
              toast({
                title: "새로운 곡을 가져옵니다",
                status: "info",
                isClosable: true,
              });
            }}
          >
            새로고침
          </Button>
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
                {!isLoading && !isError && typeof song?.info !== "undefined" ? (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {Object.keys(song?.info).map((keyName, i) => (
                          <Th key={`key-${i}}`}>{keyName}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        {Object.keys(song?.info).map((keyName, i) => (
                          <Td key={`info-${i}`}>{song.info[keyName] as any}</Td>
                        ))}
                      </Tr>
                    </Tbody>
                  </Table>
                ) : null}
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
  return { props: { initialData: song } };
};
