import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { Styles } from "@chakra-ui/theme-tools";

const colors = {};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};
const fonts = {
  heading: "Noto Sans KR",
  body: "Noto Sans KR",
};

const styles: Styles = {
  global: {
    "html, #__next, body": {
      height: "100%",
      boxSizing: "border-box",
      touchAction: "manipulation",
      textRendering: "optimizeLegibility",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    "#__next": {
      display: "flex",
      flexDirection: "column",
    },
    ".body": {
      // todo check how to do this without breaking the site
      // height: '100%', // Push footer to bottom
      overflowY: "scroll", // Always show scrollbar to avoid flickering
      margin: 0,
    },
    html: {
      // scrollBehavior: "smooth",
    },
    "#nprogress": {
      pointerEvents: "none",
    },
    "#nprogress .bar": {
      background: "#fffc3a",
      position: "fixed",
      zIndex: "99999",
      top: 0,
      left: 0,
      width: "100%",
      height: "3px",
    },
    /**
     * Chrome has a bug with transitions on load since 2012!
     *
     * To prevent a "pop" of content, you have to disable all transitions until
     * the page is done loading.
     *
     * https://lab.laukstein.com/bug/input
     * https://twitter.com/timer150/status/1345217126680899584
     */
    "body.loading *": {
      transition: "none !important",
    },
  },
};

const theme = extendTheme({ colors, fonts, config, styles });

export default theme;
