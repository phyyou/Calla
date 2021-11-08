import Head from "next/head";
import { useEffect, useState, useRef } from "react";

import {
  Container,
  Box,
  VStack,
  Text,
  Img,
  Switch,
  Heading,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";

import { ArrowLeftIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { event } from "../lib/ga/analytics";
import { useTransfomer } from "../lib/hooks/useTransformer";
import { useRouter } from "next/router";

export default function Transformer() {
  const { url, isError, isLoading, mutate } = useTransfomer();
  const toast = useToast();
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Calla - Transformer</title>
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
            <Heading size={"md"}>
              Calla - Transformer - Built with magenta.
            </Heading>
            <Text>인공지능으로 클래식 음악을 생성하고 재생합니다.</Text>
          </Box>

          <Box textAlign={"center"}>
            <Heading mb={2} width={"90vw"} userSelect={"all"}>
              인공지능 생성 음악
            </Heading>
            {typeof url === "undefined" && (
              <Text>음악 생성에는 약 1분 소요됩니다.</Text>
            )}
          </Box>
          {!isLoading && !isError ? (
            <audio
              style={{ marginBottom: "var(--chakra-space-4)" }}
              onEnded={(e) => {
                e.preventDefault();
                console.log(isAutoPlay);
                if (isAutoPlay) {
                  mutate(
                    "https://calla-rest.azurewebsites.net/transformer/scratch"
                  );
                  toast({
                    title: "새로운 곡을 생성합니다",
                    status: "info",
                    isClosable: true,
                  });
                  event("Refresh Song by AutoPlay");
                }
              }}
              key={url}
              controls={true}
              autoPlay={true}
              loop={isAutoPlay ? false : true}
            >
              <source
                src={"https://calla-rest.azurewebsites.net" + url}
              ></source>
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
                isLoading={isLoading || isError || typeof url === "undefined"}
                mr={{ base: "0", md: "4" }}
                isDisabled={isLoading}
                loadingText="새로운 곡을 생성하는 중 입니다"
                onClick={() => {
                  mutate(
                    "https://calla-rest.azurewebsites.net/transformer/scratch"
                  );
                  toast({
                    title: "새로운 곡을 생성합니다",
                    status: "info",
                    isClosable: true,
                  });
                  event("Trsnform Song");
                }}
              >
                새로운 곡 생성
              </Button>
              <Box marginTop={{ base: "2", md: "0" }} d="flex" flexDir={"row"}>
                <FormLabel htmlFor="autoplay" mb="0">
                  <Tooltip
                    label="루프를 하지 않고 자동으로 랜덤한 다음 곡을 생성합니다."
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
            <Button
              mt={"2"}
              ml={"2"}
              rightIcon={<ArrowLeftIcon />}
              onClick={() => {
                router.push("/");
              }}
              colorScheme="teal"
              variant="outline"
            >
              랜덤 클래식 음악 들으러 가기
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
