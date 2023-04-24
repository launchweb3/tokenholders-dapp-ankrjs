import { HolderBalance } from '@ankr.com/ankr.js/dist/types';
import { useEffect, useState } from 'react';
import { getTokenHolders } from './utils';

// A custom hook called useTokenHolders
export const useTokenHolders = (contractAddress: string) => {

  // State variables to store the holders, holders count, loading state and error state

  const [holders, setHolders] = useState<HolderBalance[]>([]);
  const [holdersCount, setHoldersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // fetch the holders information

  useEffect(() => {
    const fetchHolders = async () => {

      // Set the loading state to true
      setLoading(true);
      try {
        
        // Call the getTokenHolders function and destructure the returned data
        const { holders, holdersCount } = await getTokenHolders(
          contractAddress
        );
        // Set the holders and holders count in state
        setHolders(holders);
        setHoldersCount(holdersCount);
      } catch (e) {
        // Set the error state if there was an exception thrown
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchHolders();
  }, [contractAddress]);
  // Return the holders, holders count, loading and error state
  return { holders, holdersCount, loading, error };
};