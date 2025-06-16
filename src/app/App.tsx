import { dark, light } from '@callisto-enterprise/soy-uikit2';
import { Web3ReactProvider } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
// import 'react-toastify/dist/ReactToastify.css';
// import 'react-toastify/dist/ReactToastify.min.css';
import { ToastsProvider } from '~/app/contexts/ToastsContext';
// import HomeUpdater from '~/app/modules/home/updater';
import './app.i18n';
import AppRouter from './AppRouter';
import configureStore from './core/store';
import { getLibrary } from './utils/web3React';

// toast.configure();

const ThemeProviderWrapper = (props: any) => {
  const isDark = false;

  return <ThemeProvider theme={isDark ? dark : light} {...props} />;
};

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={configureStore}>
        <ToastsProvider>
          <ThemeProviderWrapper>
            {/* <HomeUpdater /> */}
            <div className="app">
              <AppRouter />
            </div>
          </ThemeProviderWrapper>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  );
}
