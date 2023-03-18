import { MantineProvider } from "@mantine/core";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'orange',
    }}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
