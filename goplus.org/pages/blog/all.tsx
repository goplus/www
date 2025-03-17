import { GetStaticProps } from "next"
import Link from "next/link"

import { getAllArticles, ArticleMetadata } from "lib/blog"
import BlogPage from "components/Blog/BlogPage"

import styles from "./style.module.scss"

interface BlogAllProps {
  articles: ArticleMetadata[]
}

export default function BlogAll({ articles }: BlogAllProps) {
  return (
    <BlogPage articles={articles} title="Blog Index" before={
      <Link href="/blog" passHref>
        <span className={styles.news}>The GoPlus Blog</span>
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
