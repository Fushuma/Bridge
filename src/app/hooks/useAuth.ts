import { connectorLocalStorageKey, ConnectorNames } from '@callisto-enterprise/soy-uikit2';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from '@web3-react/walletconnect-connector';
import { useCallback } from 'react';
import useToast from '~/app/hooks/useToast';
import { setupNetwork } from '~/app/utils/wallet';
import { connectorsByName, getConnectorsByName } from '~/app/utils/web3React';

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const { toastError } = useToast();

  const login = useCallback(
    (connectorID: ConnectorNames, curNet: any) => {
      const connectorsByName1 = getConnectorsByName(curNet);
      const connector = connectorsByName1[connectorID];
      if (connector) {
        try {
          activate(connector, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork(curNet);
              if (hasSetup) {
                activate(connector);
              }
            } else {
              window.localStorage.removeItem(connectorLocalStorageKey);
              if (error instanceof NoEthereumProviderError) {
                toastError('No provider was found');
              } else if (
                error instanceof UserRejectedRequestErrorInjected ||
                error instanceof UserRejectedRequestErrorWalletConnect
              ) {
                if (connector instanceof WalletConnectConnector) {
                  const walletConnector = connector as WalletConnectConnector;
                  walletConnector.walletConnectProvider = null;
                }
                toastError('Please authorize to access your account');
              } else {
                toastError(error.message);
              }
            }
          });
        } catch (error) {
          toastError('Unable to find connector', 'The connector config is wrong');
        }
      } else {
        toastError('Unable to find connector', 'The connector config is wrong');
      }
    },
    [activate, toastError]
  );

  const logout = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
    }
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
