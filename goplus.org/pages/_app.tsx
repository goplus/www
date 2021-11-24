import './global.scss'
import type { AppProps } from 'next/app'
import EnsureMounted from 'components/EnsureMounted'

function MyApp({ Component, pageProps }: AppProps) {
  return <EnsureMounted><Component {...pageProps} /></EnsureMounted>
}
export default MyApp
