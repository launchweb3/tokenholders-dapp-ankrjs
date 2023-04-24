import type { NextPage } from 'next';
import { useState } from 'react';
import { useTokenHolders } from '../hooks';

const Home: NextPage = () => {
  // State for storing the entered contract address
  const [contractAddress, setContractAddress] = useState(
    //this is Developer DAO's $CODE token address
    '0xb24cd494fae4c180a89975f1328eab2a7d5d8f11'
  );
  // Call the custom hook `useTokenHolders` with the entered contract address
  const { holders, loading, error } = useTokenHolders(contractAddress);

  return (
    <div className='p-10 flex flex-col items-center'>           
      <h1 className='text-5xl font-bold'>ERC20 Token Holders Viewer</h1>
      <br></br>
      <h1 className='text-zinc text-3xl font-bold'>
        Powered by 🌈 {' '}
        <a 
          href='https://www.ankr.com/advanced-api/'
          target='_blank'
          rel='noreferrer'
          className='text-blue-700 cursor-pointer underline'
        >
          Ankr Advanced APIs
        </a>
      </h1>
      <br></br>
      <div className='flex flex-col mt-4 items-center'>
          <h1 className='text-2xl font-bold'>Enter Token Contract Address:</h1>
        <input
          id='wallet-address'
          type='text'

          // Input value is set to the current contract address
          value={contractAddress}

          // Update contract address state on input change
          onChange={(e) => setContractAddress(e.target.value)}
          className='rounded p-2 w-[375px] border'
          placeholder='Enter a wallet address here'
        />
      </div>

      {loading && (
        <div className='flex flex-col items-center mt-8'>
          <p className='text-zinc font-bold'>Loading...</p>
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