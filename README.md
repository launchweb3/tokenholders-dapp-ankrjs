# 🤝 ERC20 Token Holders Viewer dApps

This is an demo [Next.js](https://nextjs.org/) project built using [Ankr.js](https://www.ankr.com/docs/advanced-api/javascript-sdk/) and [Ankr Advanced APIs](https://www.ankr.com/advanced-api/). 

### Tech Stack 
- Next.js as the React/frontend framework
- TailwindCSS as the CSS framework
- AnkrJS SDK to interact with Advanced APIs
- Advanced APIs as the data source

![screely-1675253578816](https://user-images.githubusercontent.com/44579545/216039488-309296d5-152b-40f1-8e13-fae347ce3dd0.png)

## Step 1: Setting Up Your Next.js Starter Project
Navigate into a directory of your choice and run the following command in your terminal to set up a new Next.js project:
```
yarn create next-app --ts ankrjs-tutorial
```
You can now navigate into the directory and l
Next, you will install and set up Ankr.js so that you can use it to fetch all the NFTs for a given wallet address later on.

Start by installing the ankr.js package from npm:aunch the app:
```
cd ankrjs-tutorial
```
```
yarn dev
```

## Step 2: Installing And Setting Up Ankr.js
Next, you will install and set up Ankr.js so that you can use it to fetch all the token holders for a given contract address.

Start by installing the ankr.js package from npm:
```
# ./ankrjs-tutorial
yarn add `@ankr.com/ankr.js
```

Next, **create a new file named `utils.ts`** at the root of your project directory. You will initialize Ankr.js in this file.
**File:** `./utils.ts`
```javascript
import { AnkrProvider } from '@ankr.com/ankr.js';

const provider = new AnkrProvider();
```
Your provider instance will be your interface to the Ankr Advanced APIs whenever you want to fetch some data from them.

## Step 3: Creating Token Holders Retrieval Function
In this step, you will create a **getTokenHolders** function that accepts a contractAddress and returns a list of holders.

You can utilize the `getTokenHolders` function provided by Ankr.js for this.

**File:** `./utils.ts`
```javascript
import AnkrProvider from '@ankr.com/ankr.js';

// Create an instance of the AnkrProvider 
const provider = new AnkrProvider('');

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
  ```
## Step 4: Custom Hook for Token Holders Info

This code exports a custom hook named `useTokenHolders` that can be used in a React component to fetch token holders information for a given contract address. 

The hook uses the useEffect hook from React to fetch the information when the contract address changes, and sets the holders and holders count data in state using `setHolders` and `setHoldersCount`. I

t also sets a loading state using `setLoading` to indicate when the data is being fetched, and an error state using `setError` to indicate if there was an error while fetching the data. 

**The hook returns an object with the holders, holders count, loading state, and error state.**

**File:** `./hooks.ts`
```javascript
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
```


  
  ## Step 5: Creating Contract Address Input and Displaying the Data
You will now add an input to the UI that lets the user input any contract address they want and pass it to the getTokenHolders function.

You can keep track of the contract address input in a state variable named contractAddress, hook it up to the input element in the UI, and then pass contractAddress to the getTokenHolders function.

**File:** `./pages/index.tsx`
```javascript
import type { NextPage } from 'next';
import { useState } from 'react';
import { useTokenHolders } from '../hooks';

const Home: NextPage = () => {
  // State for storing the entered contract address
  const [contractAddress, setContractAddress] = useState(
    '0xb24cd494fae4c180a89975f1328eab2a7d5d8f11'
  );
  // Call the custom hook `useTokenHolders` with the entered contract address
  const { holders, loading, error } = useTokenHolders(contractAddress);

  return (
    <div className='p-10 flex flex-col items-center'>
      <h1 className='text-3xl font-bold'>ERC20 token holders viewer</h1>
      <h3 className='text-zinc-700'>
        Powered by{' '}
        <a
          href='https://www.ankr.com/advanced-api/'
          target='_blank'
          rel='noreferrer'
          className='cursor-pointer underline'
        >
          Ankr Advanced APIs
        </a>
      </h3>

      <div className='flex flex-col mt-4'>
        <label className='text-zinc-700' htmlFor='wallet-address'>
          ERC20 Token Contract Address
        </label>
        <input
          id='wallet-address'
          type='text'

          // Input value is set to the current contract address
          value={contractAddress}

          // Update contract address state on input change
          onChange={(e) => setContractAddress(e.target.value)}
          className='rounded p-2 w-[400px] border'
          placeholder='Enter a wallet address here'
        />
      </div>

      {loading && (
        <div className='flex flex-col items-center mt-8'>
          <p className='text-zinc-700'>Loading...</p>
        </div>
      )}

      {holders.length > 0 && !loading && (
        <table className='mt-8'>
          <thead className='p-4 border rounded'>
            <tr>
              <th>Address</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder) => {
              return (
                <tr key={holder.holderAddress} className='border'>
                  <td className='p-2'>{holder.holderAddress}</td>
                  <td className='p-2'>{holder.balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {error && (
        <div className='flex flex-col items-center mt-8'>
          <p className='text-red-700'>
            Error: {JSON.stringify(error, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
```
## Step 6: Run the app!
```
yarn dev
```
