import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { RPCs } from '../constants';
import { NATIVE_W_COINS } from '../constants/tokens';
import useGetWalletState from '../modules/wallet/hooks';
import { getSoyRouterContractByWeb3 } from '../utils';
import { getDecimalAmount } from '../utils/decimal';
import { useWeb3Provider } from './wallet';

const BIG_ZERO = new BigNumber(0);

export const useGetAmountsOut = (amount: string) => {
  const [amountsOut, setAmountsOut] = useState(BIG_ZERO);

  const { selectedToken, toNetwork } = useGetWalletState();
  const swapTokenAddrInCallisto = selectedToken?.address[toNetwork.chainId];
  const provider = useWeb3Provider(RPCs[`${toNetwork.chainId}`]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const contract = await getSoyRouterContractByWeb3(provider, Number(toNetwork.chainId));
        const bigAmount = getDecimalAmount(new BigNumber(amount));
        const path = [swapTokenAddrInCallisto, NATIVE_W_COINS[`${toNetwork.chainId}`]];
        const outAmt = await contract.methods.getAmountsOut(bigAmount.toString(), path).call();
        setAmountsOut(outAmt[1]);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      !Number.isNaN(parseFloat(amount)) &&
      swapTokenAddrInCallisto !== '' &&
      (toNetwork.chainId === '820' || toNetwork.chainId === '199') &&
      swapTokenAddrInCallisto.slice(0, -2) !== '0x00000000000000000000000000000000000000'
    ) {
      fetch();
    } else {
      setAmountsOut(BIG_ZERO);
    }
  }, [amount, provider, selectedToken, swapTokenAddrInCallisto, toNetwork.chainId]);

  return amountsOut;
};

export const useGetAmountsInput = (amount: string) => {
  const [amountsOut, setAmountsOut] = useState(BIG_ZERO);
  const { selectedToken, toNetwork } = useGetWalletState();
  const swapTokenAddrInCallisto = selectedToken?.address[toNetwork.chainId];
  const provider = useWeb3Provider(RPCs[`${toNetwork.chainId}`]);

  useEffect(() => {
    const fetch = async () => {
      const contract = await getSoyRouterContractByWeb3(provider, Number(toNetwork.chainId));
      const bigAmount = getDecimalAmount(new BigNumber(amount));

      const path = [swapTokenAddrInCallisto, NATIVE_W_COINS[`${toNetwork.chainId}`]];
      const outAmt = await contract.methods.getAmountsIn(bigAmount.toString(), path).call();
      setAmountsOut(outAmt[0]);
    };
    if (
      !Number.isNaN(parseFloat(amount)) &&
      swapTokenAddrInCallisto !== '' &&
      (toNetwork.chainId === '820' || toNetwork.chainId === '199') &&
      swapTokenAddrInCallisto.slice(0, -2) !== '0x00000000000000000000000000000000000000'
    ) {
      fetch();
    } else {
      setAmountsOut(BIG_ZERO);
    }
  }, [amount, provider, selectedToken, swapTokenAddrInCallisto, toNetwork.chainId]);

  return amountsOut;
};
