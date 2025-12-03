import { ethers } from 'ethers';
import contracts from '../constants/contracts';

// Known valid bridge addresses from contracts.ts
const VALID_BRIDGE_ADDRESSES = Object.values(contracts.bridge).map((addr: string) =>
  addr.toLowerCase()
);

// Supported chain IDs
const SUPPORTED_CHAIN_IDS = Object.keys(contracts.bridge).map(Number);

/**
 * Validates that an Ethereum address is valid using checksum
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Returns a checksummed address if valid, null otherwise
 */
export const getChecksumAddress = (address: string): string | null => {
  try {
    return ethers.utils.getAddress(address);
  } catch {
    return null;
  }
};

/**
 * Validates that the bridge address from API response matches known addresses
 */
export const isValidBridgeAddress = (bridgeAddress: string): boolean => {
  if (!bridgeAddress || typeof bridgeAddress !== 'string') {
    return false;
  }
  return VALID_BRIDGE_ADDRESSES.includes(bridgeAddress.toLowerCase());
};

/**
 * Validates that the chain ID is supported
 */
export const isSupportedChainId = (chainId: number | string): boolean => {
  const numericChainId = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;
  return SUPPORTED_CHAIN_IDS.includes(numericChainId);
};

/**
 * Validates the API response from signature endpoints
 */
export const validateClaimResponse = (respJSON: any): { valid: boolean; error?: string } => {
  if (!respJSON) {
    return { valid: false, error: 'Empty response from API' };
  }

  // Validate bridge address
  if (respJSON.bridge && !isValidBridgeAddress(respJSON.bridge)) {
    return { valid: false, error: 'Invalid bridge address in response' };
  }

  // Validate chain ID
  if (respJSON.chainId && !isSupportedChainId(respJSON.chainId)) {
    return { valid: false, error: 'Unsupported chain ID in response' };
  }

  // Validate destination address
  if (respJSON.to && !isValidAddress(respJSON.to)) {
    return { valid: false, error: 'Invalid destination address in response' };
  }

  // Validate original token address
  if (respJSON.originalToken && !isValidAddress(respJSON.originalToken)) {
    return { valid: false, error: 'Invalid token address in response' };
  }

  // Validate value is a valid number string
  if (respJSON.value) {
    try {
      ethers.BigNumber.from(respJSON.value);
    } catch {
      return { valid: false, error: 'Invalid value in response' };
    }
  }

  return { valid: true };
};
