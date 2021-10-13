import Image from 'next/image'

import styles from './style.module.css'

export default function Intro() {
  return (
    <div className={styles.introWrap}>
      <div className={styles.section}>
        <div className={styles.goPlus}>
          <Image width={120} height={34} src="/go_plus.svg" alt="Go Plus Logo" />
        </div>
        <div className={styles.title}>The Go+ language for engineering, STEM education, and data science</div>
        <div className={styles.btnsWrap}>
          <a href="" className={styles.primaryBtn}>
            Try Go+
          </a>
          <a href="" className={styles.btn}>
            <Image width={24} height={16} src="/download.svg" alt="Download Logo" />
            <span>Download Go+</span>
          </a>
        </div>
        <Image width={172} height={133} src="/qiniu_doll.png" alt="Qiniu Doll Logo" />
      </div>
    </div>
  )
}
