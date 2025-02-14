import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider, MantineTheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useHotkeys } from '@mantine/hooks';
import { ConfigProvider } from '../tools/state';
import { theme } from '../tools/theme';
import { styles } from '../tools/styles';
import { ColorTheme } from '../tools/color';

export default function App(this: any, props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const [primaryColor, setPrimaryColor] = useState<MantineTheme['primaryColor']>('red');
  const [secondaryColor, setSecondaryColor] = useState<MantineTheme['primaryColor']>('orange');
  const [primaryShade, setPrimaryShade] = useState<MantineTheme['primaryShade']>(6);
  const colorTheme = {
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
    primaryShade,
    setPrimaryShade,
  };

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <ColorTheme.Provider value={colorTheme}>
          <MantineProvider
            theme={{
              ...theme,
              primaryColor,
              primaryShade,
              colorScheme,
            }}
            styles={{
              ...styles,
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider limit={4} position="bottom-left">
              <ConfigProvider>
                <Component {...pageProps} />
              </ConfigProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorTheme.Provider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('color-scheme', ctx) || 'light',
});
