import BigNumber from 'bignumber.js';

const BIG_TEN = new BigNumber(10);

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  const _amount = new BigNumber(amount).times(BIG_TEN.pow(decimals));
  const [leftSide] = _amount.toString().split('.');
  return new BigNumber(leftSide);
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};
