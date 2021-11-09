import Image from 'next/image'

import { useMobile } from '../../../hooks'
import styles from './style.module.scss'

export default function Intro() {

  const isMobile = useMobile()

  const qiniuDollSize = (
    isMobile
    ? { width: 120, height: 97 }
    : { width: 172, height: 133 }
  )

  return (
    <div className={styles.introWrap}>
      <div className={styles.section}>
        <div className={styles.goPlus}>
          <Image width={120} height={34} src="/go_plus.svg" alt="Go Plus Logo" />
        </div>
        <div className={styles.title}>The Go+ language for engineering, STEM education, and data science</div>
        <div className={styles.btnsWrap}>
          <a href="https://play.goplus.org" className={styles.primaryBtn} rel="noopener">
            Try Go+
          </a>
          <a href="https://github.com/goplus/gop#how-to-install" className={styles.btn} rel="noopener">
            <Image width={24} height={16} src="/download.svg" alt="Download Icon" />
            <span className={styles.installTxt}>Install Go+</span>
          </a>
        </div>
        <Image {...qiniuDollSize} src="/qiniu_doll.png" alt="Qiniu Doll" />
      </div>
    </div>
  )
}
