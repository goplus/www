import Layout from 'components/Layout'
import Centered from 'components/Centered'
import ArticleList from "../ArticleList"
import styles from "./style.module.scss"
import { ArticleMetadata } from "lib/blog"
import { ReactNode } from "react"

interface BlogPageProps {
    articles: ArticleMetadata[]
    title: string
    before?: ReactNode
    after?: ReactNode
}

export default function BlogPage({ articles, before, after, title }: BlogPageProps) {
  return (
    <Layout>
      <Centered>
        <div className={styles.wrapper}>
          {before}
          <h1 className={styles.title}>{title}</h1>
          <ArticleList articles={articles}/>
          {after}
        </div>
      </Centered>
    </Layout>
  )
}