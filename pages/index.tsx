import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useState, useRef } from "react";

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
  IconButton,
  useClipboard,
} from "@chakra-ui/react";

import { ISongInfo } from "../lib/types/song";
import { getSongInfo, useSong } from "../lib/hooks/useSong";
import { ArrowRightIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { event } from "../lib/ga/analytics";
import {
  InfoCard,
  InfoCardContent,
  InfoCardProperty,
} from "../components/InfoCard";

import { useRouter } from "next/router";

export default function Home({ initialData }: { initialData: ISongInfo }) {
  const { song, isError, isLoading, mutate } = useSong(initialData);
  const toast = useToast();
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [title, setTitle] = useState(initialData?.info["Work Title\n"]);
  const { hasCopied, onCopy } = useClipboard(title);
  const audioRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    if ("mediaSession" in navigator) {
      // @ts-ignore
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        mutate("/api/song");
        toast({
          title: "새로운 곡을 가져옵니다",
          status: "info",
          isClosable: true,
        });
        event("Refresh Song by media session api");
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof song?.info !== "undefined") {
      setTitle(song?.info["Work Title\n"]);
      console.log(song?.info);
      // @ts-ignore
      if ("mediaSession" in navigator) {
        // @ts-ignore
        navigator.mediaSession.metadata = new MediaMetadata({
          title: title,
          artist: song?.info["Composer\n"],
        });

        // @ts-ignore
        navigator.mediaSession.setActionHandler("play", async () => {
          await audioRef.current?.play();
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler("pause", () => {
          audioRef.current?.pause();
        });
        audioRef.current?.addEventListener("play", () => {
          // @ts-ignore
          navigator.mediaSession.playbackState = "playing";
        });
        audioRef.current?.addEventListener("pause", () => {
          // @ts-ignore
          navigator.mediaSession.playbackState = "paused";
        });
      }
    }
  }, [song?.info, title, audioRef]);

  return (
    <>
      <Head>
        <title>
          {
            !isLoading && !isError && typeof song?.info !== "undefined" && typeof song?.info["Composer\n"] !== "undefined" ? (
              `${title} (${song?.info["Composer\n"].trimEnd()}) - Calla Music`
            ) : "Calla Music"
          }
        </title>
        <meta name="description" content="Recommend Random Classical Music" />
        <link type="image/svg+xml" rel="icon" href="/icons/Calla.svg" />
      </Head>

      <Container as={"main"}>
        <VStack marginTop={{ base: "20vh", md: "16vh" }}>
          <Box d={"flex"} flexDir={"column"} alignItems={"center"}>
            <Img
              alt={"Logo-Calla"}
              src={"/icons/Calla.svg"}
              w={{ base: 16, md: 32 }}
            ></Img>
            <Heading size={"md"}>Calla</Heading>
            <Text>랜덤으로 클래식 음악을 추천하고 재생합니다.</Text>
          </Box>

          <Box textAlign={"center"}>
            {!isLoading && !isError && typeof song?.info !== "undefined" ? (
              <>
                <Heading
                  mb={2}
                  width={"90vw"}
                  userSelect={"all"}
                  onClick={onCopy}
                >
                  {song?.info["Work Title\n"]}
                  {/* <IconButton
                    aria-label="Copy Song Title"
                    icon={<CopyIcon />}
                    w={"var(--chakra-sizes-8)!important"}
                    minW={"unset!important"}
                    h={8}
                    onClick={onCopy} 
                  /> */}
                </Heading>
              </>
            ) : null}
            {!isLoading && !isError && typeof song?.info !== "undefined" ? (
              <>
                <Text mb={-1} size={"sm"}>
                  작곡가
                </Text>
                <Heading mb={2} size={"md"} as={"h6"}>
                  {song?.info["Composer\n"]}
                </Heading>
              </>
            ) : null}
          </Box>
          {!isLoading && !isError ? (
            <audio
              style={{ marginBottom: "var(--chakra-space-4)" }}
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
              ref={audioRef}
              key={song.file}
              controls={true}
              autoPlay={true}
              loop={isAutoPlay ? false : true}
            >
              <source src={song?.file}></source>
            </audio>
          ) : null}
          <Box>
            <FormControl
              display="flex"
              alignItems="center"
              flexDir={{ base: "column", md: "row" }}
            >
              <Button
                rightIcon={<ArrowForwardIcon />}
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
                새로운 곡
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
            {/* <Button
              mt={"2"}
              rightIcon={<ArrowRightIcon />}
              onClick={() => {
                router.push("/transformer");
              }}
              colorScheme="teal"
              variant="outline"
            >
              클래식 음악 생성 인공지능
            </Button> */}
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
