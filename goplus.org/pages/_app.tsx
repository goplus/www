import './global.scss'
import type { AppProps } from 'next/app'
import EnsureReady from 'components/EnsureReady'

function MyApp({ Component, pageProps }: AppProps) {
  return <EnsureReady><Component {...pageProps} /></EnsureReady>
}
export default MyApp
