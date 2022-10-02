import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = {};

const theme = extendTheme({
  config,
  components,
});

export default theme;
