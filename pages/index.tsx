import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import {
  Container,
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
import {
  InfoCard,
  InfoCardContent,
  InfoCardProperty,
} from "../components/InfoCard";

export default function Home({ initialData }: { initialData: ISongInfo }) {
  const { song, isError, isLoading, mutate } = useSong(initialData);
  const toast = useToast();
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof song?.info !== "undefined" &&
      typeof song?.info["Work Title\n"] !== "undefined"
    )
      document.title = `${song?.info["Work Title\n"]} | Calla Music`;
  }, [song?.info]);
  return (
    <>
      <Head>
        <title>Calla</title>
        <meta name="description" content="Recommend Random Classical Music" />
        <link type="image/svg+xml" rel="icon" href="/Calla.svg" />
      </Head>

      <Container as={"main"}>
        <VStack marginTop={{ base: "18vh", md: "10vh" }}>
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
                  event("Refresh Song by AutoPlay");
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
                mr={{ base: "0", md: "4" }}
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
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>

              <AccordionPanel pb={4}>
                {!isLoading && !isError && typeof song?.info !== "undefined" ? (
                  <>
                    <InfoCard mb={4} maxW="4xl" mx="auto">
                      <InfoCardContent>
                        {Object.keys(song?.info).map((keyName, i) => (
                          <InfoCardProperty
                            key={`info-key-${i}}`}
                            label={keyName}
                            value={song.info[keyName]}
                          />
                        ))}
                        <InfoCardProperty
                          key={`info-license`}
                          label={"IMSLP CC BY-SA 4.0"}
                          value={song.copy}
                        />
                      </InfoCardContent>
                    </InfoCard>
                  </>
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
