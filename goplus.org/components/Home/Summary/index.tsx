import React from 'react'

import styles from './style.module.css'

export default function Summary() {
  const [selected, setSelected] = React.useState(0)
  const items = React.useRef([
    {
      title: 'For Engineering',
      advantages: [
        'Compatible with full.',
        'The grammar is simpler and more elegant, which is closer to natural language than Go.',
        'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
        'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
      ]
    },
    {
      title: 'For STEM Education',
      advantages: [
        'Compatible with full.',
        'The grammar is simpler and more elegant, which is closer to natural language than Go.',
        'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
        'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
      ]
    },
    {
      title: 'For Data Science',
      advantages: [
        'Compatible with full.',
        'The grammar is simpler and more elegant, which is closer to natural language than Go.',
        'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
        'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
      ]
    }
  ])
  return (
    <div className={styles.section}>
      <div className={styles.title}>Why Go+</div>
      <div className={styles.tabs}>
        {items.current.map((item, index) => (
          <div
            className={`${styles.tab} ${selected === index ? styles.selected : ''}`}
            key={item.title}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <ul className={styles.advantages}>
        {items.current[selected].advantages.map((advantage, index) => (
          <li className={styles.advantage} key={index}>
            {advantage}
          </li>
        ))}
      </ul>
    </div>
  )
}
