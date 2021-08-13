import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";

const InfoCard = (props: BoxProps) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    rounded={{ md: "lg" }}
    border={"1px"}
    borderColor={"gray.50"}
    overflow="hidden"
    {...props}
  />
);

export default InfoCard;
