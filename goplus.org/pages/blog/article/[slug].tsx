import { GetStaticProps, GetStaticPaths } from 'next'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import Layout from 'components/Layout'
import Centered from 'components/Centered'
import { formatDate } from '../all'
import CodeForMD from "components/CodeForMD"

import styles from './style.module.scss'
import { Article, ArticleNavigation, getArticleData, getAllArticles } from 'lib/article'

interface BlogProps {
  article: Article
  navigation: ArticleNavigation
}

export default function Blog({ article,navigation }: BlogProps) {
  return (
    <Layout>
      <Centered>
        <Link href="/blog" passHref>
          <a className={styles.news}>The GoPlus Blog</a>
        </Link>
        <article>
          <h1>{article.title}</h1>
          <div className={styles.date}>{formatDate(article.date)}</div>
          <div className={styles.author}>{article.by.join(', ')}</div>
          <div className={styles.articleContent}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt, ...props }) => {
                  const imageSrc = src?.startsWith('http') ? src : `/api/article-image?path=${encodeURIComponent(`${src || ''}`)}`
                  return <img src={imageSrc} alt={alt} {...props} />
                },
                code: ({ node, children, ...props }) => {
                  return <CodeForMD {...props}>{children}</CodeForMD>
                }
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          {navigation && (
            <div className={styles.navigation}>
              <div className={styles.navigationLinks}>
                {navigation.prev && (
                  <div className={styles.navItem}>
                    <span className={styles.navLabel}>Previous article:</span>
                    <Link href={`/blog/article/${navigation.prev.slug}`} passHref>
                      <a className={styles.prevLink}>{navigation.prev.title}</a>
                    </Link>
                  </div>
                )}
                {navigation.next && (
                  <div className={styles.navItem}>
                    <span className={styles.navLabel}>Next article:</span>
                    <Link href={`/blog/article/${navigation.next.slug}`} passHref>
                      <a className={styles.nextLink}>{navigation.next.title}</a>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/blog/all" passHref>
                <a className={styles.blogIndex}>Blog Index</a>
              </Link>
            </div>
          )}
        </article>
      </Centered>
    </Layout>
  )
}

// Generate the paths for all blog posts
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllArticles().map(article => ({
    params:{
      slug:article.slug
    }
  })
  )
  return {
    paths,
    fallback: false
  }
}

// Get the content for a specific blog post
export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
  const slug = params?.slug
  const articleInfo = getArticleData(slug as string)

  return {
    props: {
      article:articleInfo.article,
      navigation:articleInfo.navigation
    }
  }
} 