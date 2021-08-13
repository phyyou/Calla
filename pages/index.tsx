import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

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
  Switch,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";

import { ISongInfo } from "../lib/types/song";
import { getSongInfo, useSong } from "../lib/hooks/useSong";
import { RepeatIcon } from "@chakra-ui/icons";
import { event } from "../lib/ga/analytics";

export default function Home({ initialData }: { initialData: ISongInfo }) {
  const { song, isError, isLoading, mutate } = useSong(initialData);
  const toast = useToast();
  const [isAutoPlay, setIsAutoPlay] = useState(false);

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
            <audio
              onEnded={(e) => {
                e.preventDefault();
                console.log(isAutoPlay);
                if (isAutoPlay) {
                  mutate("/api/song");
                  toast({
                    title: "새로운 곡을 가져옵니다",
                    status: "info",
                    isClosable: true,
                  });
                  event("Refresh Song");
                }
              }}
              key={song.file}
              controls={true}
              autoPlay={true}
              loop={isAutoPlay ? false : true}
            >
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
          <Box>
            <FormControl
              display="flex"
              alignItems="center"
              flexDir={{ base: "column", md: "row" }}
            >
              <Button
                leftIcon={<RepeatIcon />}
                isLoading={
                  isLoading || isError || typeof song?.info === "undefined"
                }
                mr={{ base: null, md: "4" }}
                isDisabled={isLoading}
                loadingText="새로운 곡을 가져오는 중 입니다"
                onClick={() => {
                  mutate("/api/song");
                  toast({
                    title: "새로운 곡을 가져옵니다",
                    status: "info",
                    isClosable: true,
                  });
                  event("Refresh Song");
                }}
              >
                새로고침
              </Button>
              <Box marginTop={{ base: "2", md: "0" }} d="flex" flexDir={"row"}>
                <FormLabel htmlFor="autoplay" mb="0">
                  <Tooltip
                    label="루프를 하지 않고 자동으로 랜덤한 다음 곡을 재생합니다."
                    aria-label="A description of switch"
                  >
                    자동재생
                  </Tooltip>
                </FormLabel>
                <Switch
                  isChecked={isAutoPlay}
                  onChange={() => {
                    setIsAutoPlay(!isAutoPlay);
                  }}
                  id="autoplay"
                />
              </Box>
            </FormControl>
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
