import { GetStaticProps } from "next"
import Link from "next/link"

import { getAllArticles, ArticleMetadata } from "lib/blog"
import BlogPage from "components/Blog/BlogPage"

import styles from "./style.module.scss"

interface BlogNewsProps {
  articles: ArticleMetadata[]
}

export default function BlogNews({ articles }: BlogNewsProps) {
  return <BlogPage articles={articles} title="The GoPlus Blog" after={
    <Link href="/blog/all" passHref>
      <span className={styles.all}>More articles...</span>
    </Link>
  }/>
}

export const getStaticProps: GetStaticProps<BlogNewsProps> = async () => {
  const articles = getAllArticles(10)
  return {
    props: {
      articles,
    },
  }
}
