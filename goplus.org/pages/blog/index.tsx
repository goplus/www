import { GetStaticProps } from "next"
import Link from "next/link"

import { getAllArticles, ArticleMetadata } from "lib/article"
import { BlogPage } from "./all"

import styles from "./style.module.scss"

interface BlogNewsProps {
  articles: ArticleMetadata[]
}

export default function BlogNews({ articles }: BlogNewsProps) {
  return <BlogPage articles={articles} title="The GoPlus Blog" after={
    <Link href="/blog/all" passHref>
      <a className={styles.all}>More articles...</a>
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
