import { ReactNode, useState } from "react"
import { GetStaticProps } from "next"
import Link from "next/link"

import { getAllArticles, ArticleMetadata } from "lib/article"

import styles from "./style.module.scss"

import Layout from 'components/Layout'
import Centered from 'components/Centered'

interface ArticleListProps {
  articles : ArticleMetadata[]
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function ArticleItem(article:ArticleMetadata){
  const [time] = useState(()=> formatDate(article.date))
  return (
    <div className={styles.article}>
      <a className={styles.title} href={`/blog/article/${article.slug}`}>
        {article.title}
      </a>
      <span className={styles.date}>
        {time}
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

function ArticleList({articles}:ArticleListProps){
  return (
    <div className={styles.articles}>
      {articles.map((article) => (
        <ArticleItem key={article.slug} {...article}/>
      ))}
    </div>
  ) 
}

interface BlogPageProps {
    articles: ArticleMetadata[]
    title: string
    before?: ReactNode
    after?: ReactNode
}

export function BlogPage({ articles, before, after, title }: BlogPageProps) {
  return (
    <Layout>
      <Centered>
        <div className={styles.wrapper}>
          {before}
          <h1 className={styles.BlogListTitle}>{title}</h1>
          <ArticleList articles={articles}/>
          {after}
        </div>
      </Centered>
    </Layout>
  )
}

interface BlogAllProps {
  articles: ArticleMetadata[]
}

export default function BlogAll({ articles }: BlogAllProps) {
  return (
    <BlogPage articles={articles} title="Blog Index" before={
      <Link href="/blog" passHref>
        <a className={styles.news}>The GoPlus Blog</a>
      </Link>
    }/>
  )
}

export const getStaticProps: GetStaticProps<BlogAllProps> = async () => {
  const articles = getAllArticles(0)
  return {
    props: {
      articles,
    },
  }
}
