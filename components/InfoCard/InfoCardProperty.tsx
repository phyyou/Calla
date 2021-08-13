import {
  Box,
  Flex,
  FlexProps,
  useColorModeValue,
  Divider,
  Tooltip,
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
        w={{ md: "50%" }}
        paddingInlineEnd={4}
        fontWeight="semibold"
      >
        {label}
      </Box>
      <Divider mb={2} display={{ md: "none" }} />
      <Tooltip label={value} aria-label={label}>
        <Box
          as="dd"
          w={{ md: "50%" }}
          flex="1"
          h={"2.4rem"}
          overflow={"hidden"}
          lineHeight={"1.2rem"}
          textOverflow={"ellipsis"}
          sx={{
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
          }}
        >
          {value}
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default InfoCardProperty;
