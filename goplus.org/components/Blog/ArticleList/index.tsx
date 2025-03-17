import { ArticleMetadata } from "lib/blog"
import styles from "./style.module.scss"

interface ArticleListProps {
  articles : ArticleMetadata[]
}

// todo:daynamic show time format on different time zone
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function ArticleItem(article:ArticleMetadata){
  return (
    <div className={styles.article}>
      <a className={styles.title} href={`/blog/article/${article.slug}`}>
        {article.title}
      </a>
      <span className={styles.date}>
        {formatDate(article.date)}
      </span>
      <div className={styles.author}>
        <span>{article.by.join(', ')}</span>
      </div>
      <div className={styles.summary}>
        {article.summary}
      </div>
    </div>
  )
}

export default function ArticleList({articles}:ArticleListProps){
  return (
    <div className={styles.articles}>
      {articles.map((article) => (
        <ArticleItem key={article.slug} {...article}/>
      ))}
    </div>
  ) 
}