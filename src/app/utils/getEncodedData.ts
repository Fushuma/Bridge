import BigNumber from 'bignumber.js';

const method = {
  type: 'function',
  stateMutability: 'nonpayable',
  outputs: [{ type: 'uint256[]', name: 'amounts', internalType: 'uint256[]' }],
  name: 'swapTokensForExactCLO',
  inputs: [
    { type: 'uint256', name: 'amountOut', internalType: 'uint256' },
    { type: 'uint256', name: 'amountInMax', internalType: 'uint256' },
    { type: 'address[]', name: 'path', internalType: 'address[]' },
    { type: 'address', name: 'to', internalType: 'address' },
    { type: 'uint256', name: 'deadline', internalType: 'uint256' }
  ]
};

const method2 = {
  type: 'function',
  stateMutability: 'nonpayable',
  outputs: [{ type: 'uint256[]', name: 'amounts', internalType: 'uint256[]' }],
  name: 'swapExactTokensForCLO',
  inputs: [
    { type: 'uint256', name: 'amountIn', internalType: 'uint256' },
    { type: 'uint256', name: 'amountOutMin', internalType: 'uint256' },
    { type: 'address[]', name: 'path', internalType: 'address[]' },
    { type: 'address', name: 'to', internalType: 'address' },
    { type: 'uint256', name: 'deadline', internalType: 'uint256' }
  ]
};

const getEncodedData = async (web3: any, params: [BigNumber, BigNumber, [string, string], string, BigNumber]) => {
  const params2 = [params[0].toString(), params[1].toString(), params[2], params[3], params[4].toString()];
  const data = await web3.eth.abi.encodeFunctionCall(method, params2);
  return data;
};
export const getEncodedData2 = async (
  web3: any,
  params: [BigNumber, BigNumber, [string, string], string, BigNumber]
) => {
  const params2 = [params[0].toString(), params[1].toString(), params[2], params[3], params[4].toString()];
  const data = await web3.eth.abi.encodeFunctionCall(method2, params2);
  return data;
};

export default getEncodedData;
