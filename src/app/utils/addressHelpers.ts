import addresses from '~/app/constants/contracts';
import { Address } from '~/app/constants/types';

export const getAddress = (address: Address | any, chainId?: number): string => {
  return address[chainId];
};

export const getSoyRouterAddress = (): string => {
  return getAddress(addresses.soyRouter);
};

export const getSoyRouterAddressByChain = (chainId?: number): string => {
  return getAddress(addresses.soyRouter, chainId);
};

export const getBridgeAddress = (chainId: number): string => {
  return getAddress(addresses.bridge, chainId);
};
