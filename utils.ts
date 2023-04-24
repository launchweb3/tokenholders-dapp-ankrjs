import { AnkrProvider } from '@ankr.com/ankr.js';

// Create an instance of the AnkrProvider 
const provider = new AnkrProvider();

// Export a function that returns token holders information
export const getTokenHolders = async (contractAddress: string) => {
  // Call the getTokenHolders method
  //pass the contract address and (optional) blockchain type
  const { holders, holdersCount } = await provider.getTokenHolders({
    contractAddress,
    blockchain: 'eth',
  });
  
  // Log the holders to the console
  console.log({ holders });
  
  // Return the holders and holdersCount
  return {
    holders,
    holdersCount,
  };
};