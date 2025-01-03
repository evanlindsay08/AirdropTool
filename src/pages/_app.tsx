import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@solana/wallet-adapter-react-ui/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp 