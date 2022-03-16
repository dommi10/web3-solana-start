import '../styles/globals.css';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { clusterApiUrl } from '@solana/web3.js';
const WalletProvider = dynamic(() => import('../context/clientWallet'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const network = clusterApiUrl('devnet');

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
