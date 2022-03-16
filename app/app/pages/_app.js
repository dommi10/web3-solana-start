import '../styles/globals.css';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
const WalletProvider = dynamic(() => import('../context/clientWallet'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider endpoint='http://127.0.0.1:8899'>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
