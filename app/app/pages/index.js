import Head from 'next/head';
import { useState } from 'react';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PublicKey, Connection } from '@solana/web3.js';

const styles = {
  container: 'h-screen w-screen bg-gray-800',
  main: 'px-4 py-6 h-full w-full mx-auto font-bold max-w-md flex justify-center items-center text-white flex-col space-y-4',
  button:
    'w-full h-16 md:min-w-[200px] font-bold md:w-auto md:h-12 p-2 bg-purple-500 text-white rounded',
  displayText: 'text-4xl font-bold text-red-300',
  displayContainer: 'flex flex-col justify-center py-4 space-y-4 items-center',
};

const { SystemProgram, Keypair } = web3;
// create an account

const baseAccount = Keypair.generate();

const opts = {
  preflightCommitment: 'processed',
};

const programID = new PublicKey(idl.metadata.address);

export default function Home() {
  const [value, setValue] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
  const wallet = useWallet();

  async function getProvider() {
    // create provider and return it to the caller
    //  network set to local network now
    const network = process.env.NEXT_PUBLIC_ENDPOINT;
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function initialize() {
    const provider = await getProvider();

    //  create the program interface combining the idl, program ID, and provider
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.initialize('Hellow web3', {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey,
      );
      setValue(account.data.toString());
      setDataList(account.dataList);
      setInput('');
    } catch (error) {
      console.log('Transaction error: ', error);
    }
  }

  async function update() {
    try {
      if (!input) return;
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.update(input, {
        accounts: {
          baseAccount: baseAccount.publicKey,
        },
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey,
      );
      setValue(account.data.toString());
      setDataList(account.dataList);
      setInput('');
    } catch (err) {
      console.log('Transaction error: ', err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nabit Tuto</title>
        <meta name='description' content='Web3 App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        {!wallet.connected ? (
          <div>
            <WalletMultiButton />
          </div>
        ) : (
          <div>
            {!value ? (
              <div className={styles.displayContainer}>
                <h2 className={styles.displayText}>Please initialize</h2>
                <button className={styles.button} onClick={initialize}>
                  initialize
                </button>
              </div>
            ) : (
              <div>
                <button className={styles.button} onClick={update}>
                  update
                </button>

                <div className={styles.displayContainer}>
                  <input
                    placeholder='Add new data'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                  />
                  {dataList.map((item, index) => (
                    <h2 key={index} className={styles.displayText}>
                      {item}
                    </h2>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
