import Blocks from 'eth-block-timestamp';
import { useEffect, useState } from 'react';

const ethereumInfura = process.env.REACT_APP_ETH_NODE_1;
const blocks = new Blocks(ethereumInfura);

export default function useCurrentBlockTimestamp(): number | undefined {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const getTimeStamp = async () => {
      const { timestamp } = await blocks.getDate('latest');
      setTime(timestamp);
    };
    getTimeStamp();
  }, []);

  return time;
}
