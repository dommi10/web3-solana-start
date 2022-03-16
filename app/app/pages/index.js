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
  container: 'h-screen w-screen',
  main: 'px-4 py-6 h-full w-full',
  button:
    'w-full h-16 md:w-[200px] md:h-12 p-2 bg-purple-500 text-white rounded',
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
  const wallet = useWallet();

  async function getProvider() {
    // create provider and return it to the caller
    //  network set to lacol network now
    const network = 'http://127.0.0.1:8899';
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function createCounter() {
    const provider = await getProvider();

    //  create the program interface combining the idl, program ID, and provider
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.create({
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
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (error) {
      console.log('Transaction error: ', error);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    console.log('account: ', account);
    setValue(account.count.toString());
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
          <button className={styles.button}>
            {!value ? (
              <div>
                <button onClick={createCounter}>Create counter</button>
              </div>
            ) : (
              <div>
                <button onClick={increment}>Increment counter</button>
                {value >= Number(0) ? (
                  <h2>{value}</h2>
                ) : (
                  <h3>Please create the counter</h3>
                )}
              </div>
            )}
          </button>
        )}
      </main>
    </div>
  );
}
