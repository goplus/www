import Logo from 'components/Icon/Logo'
import CodeEditor from 'components/Code/Editor'
import styles from './style.module.scss'

const helloWorldCode = `// You can edit code here!
// Click "Run" button and see the result

println "Hello world"`

export default function Intro() {

  return (
    <div className={styles.section}>
      <div className={styles.goPlus}>
        <Logo width="120" height="auto" />
      </div>
      <div className={styles.slogan}>The Go+ language for engineering, STEM education, and data science</div>
      <div className={styles.btnsWrap}>
        <a href="https://github.com/goplus/gop#how-to-install" className={styles.primaryBtn} rel="noopener">
          <IconDownload />
          <span className={styles.installTxt}>Download Go+</span>
        </a>
      </div>
      <h2 className={styles.title}>Try Go+</h2>
      <CodeEditor
        className={styles.codeEditorWrapper}
        editorClassName={styles.codeEditor}
        code={helloWorldCode}
        runImmediately
      />
    </div>
  )
}

function IconDownload() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <path transform="translate(-43 -16)" fill="currentColor" d="M62.35,22.0400004 C61.6572858,18.5294648 58.5782275,15.9991911 55,16.0000002 C52.11,16.0000002 49.6,17.6400004 48.35,20.0400004 C45.3063255,20.3689191 42.9996443,22.938605 43,26.0000002 C43,29.3100004 45.69,32.0000002 49,32.0000002 L62,32.0000002 C64.76,32.0000002 67,29.7600004 67,27.0000002 C67,24.3600004 64.95,22.2200004 62.35,22.0400004 Z M60,25.0000004 L55,30.0000004 L50,25.0000004 L53,25.0000004 L53,21.0000004 L57,21.0000004 L57,25.0000004 L60,25.0000004 Z" />
    </svg>
  )
}
