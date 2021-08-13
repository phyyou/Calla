import {
  Box,
  Flex,
  FlexProps,
  useColorModeValue,
  Center,
  Divider,
} from "@chakra-ui/react";
import * as React from "react";

interface Props extends FlexProps {
  label: string;
  value: string;
}

const InfoCardProperty = (props: Props) => {
  const { label, value, ...flexProps } = props;
  return (
    <Flex
      as="dl"
      direction={{ base: "column", sm: "row" }}
      px="6"
      py="4"
      _even={{ bg: useColorModeValue("gray.50", "gray.600") }}
      {...flexProps}
    >
      <Box
        as="dt"
        minWidth="180px"
        w={"50%"}
        paddingInlineEnd={4}
        fontWeight="semibold"
      >
        {label}
      </Box>
      <Divider mb={2} display={{ md: "none" }} />
      <Box as="dd" w={"50%"} flex="1">
        {value}
      </Box>
    </Flex>
  );
};

export default InfoCardProperty;
