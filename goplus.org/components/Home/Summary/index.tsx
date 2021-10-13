import React from 'react'

import styles from './style.module.css'

export default function Summary() {
  const [selected, setSelected] = React.useState(0)
  const items = React.useRef([
    {
      title: 'For Engineering',
      content: (
        <ul>
          <li>
            All Go features will be supported (including partially support <code>cgo</code>).
          </li>
          <li>Go+ provides simpler and more elegant grammar, which is closer to natural language than Go.</li>
          <li>Go+ is easy to learn. You don&apos;t have to deal with the complexity of engineering at the start.</li>
          <li>Go+ empowers every line of code. You can do more work with less code.</li>
        </ul>
      )
    },
    {
      title: 'For STEM Education',
      content: (
        <>
          <h4>Compared with Scratch:</h4>
          <ul>
            <li>
              Scratch is designed only for the purpose of programming teaching. It is based on a block-like interface,
              which is natural and intuitive, while inconsistent with real engineering experience.
            </li>
            <li>
              Following the experience of{' '}
              <a href="https://www.codemonkey.com/" target="_blank" rel="noreferrer">
                Code Monkey
              </a>
              , Go+ uses code directly for programming teaching, which introduces low learning difficulty (not higher
              than block-based programming) and a smooth learning curve.
            </li>
            <li>
              Go+ innovatively realizes the integration of engineering and teaching. The language you learn is also the
              language you work with. By creating more productive programs, students will get a greater sense of
              learning achievement.
            </li>
          </ul>
          <p>You can find more detail on the Go+ learning site (coming soon)</p>
        </>
      )
    },
    {
      title: 'For Data Science',
      content: (
        <>
          <p>
            Go+ provides more powerful mathematical expression capabilities, such as{' '}
            <a href="#rational-number">rational number expression</a>, which simplifies data-science-purpose
            programming.
          </p>
          <p>Go+ supports bytecode backend and Go code generation.</p>
          <h4>Compared with Python, Go+ provides:</h4>
          <ul>
            <li>Better performance</li>
            <li>More natural-language-like grammar</li>
            <li>Compatibility with Python ecosystem (in the future)</li>
            <li>Same language for both data science and engineering</li>
          </ul>
        </>
      )
    }
  ])

  const transform = `translateX(${100 * selected}%)`

  return (
    <div className={styles.section}>
      <div className={styles.title}>Why Go+</div>
      <div className={styles.tabs}>
        {items.current.map((item, index) => (
          <div
            className={`${styles.tab} ${selected === index ? styles.selectedTab : ''}`}
            key={item.title}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </div>
        ))}
        <div className={`${styles.tab} ${styles.backgroundBar}`} style={{ transform }}></div>
      </div>
      <div className={styles.tabContent}>{items.current[selected].content}</div>
    </div>
  )
}
