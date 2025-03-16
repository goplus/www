import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import Layout from 'components/Layout'
import Centered from 'components/Centered'
import styles from './style.module.scss'
import { formatDate } from '../../components/Blog/ArticleList'

// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'


// use designed syntax highlight style

// may use following style
// import syntaxHighlightStyle from 'components/Code/Block/syntax-highlight-style'

// import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism'


// Define the Post type
interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    by: string[];
  };
  content: string;
  navigation?: {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
  };
}

// Component for individual blog post
export default function BlogPost({ post }: { post: Post }) {
  return (
    <Layout>
      <Centered>
        <Link href="/blog" passHref>
          <span className={styles.news}>The GoPlus Blog</span>
        </Link>
        <article>
          <h1>{post.frontmatter.title}</h1>
          <div className={styles.date}>{formatDate(post.frontmatter.date)}</div>
          <div className={styles.author}>{post.frontmatter.by.join(', ')}</div>
          <div className="post-content">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt, ...props }) => {
                  const imageSrc = src?.startsWith('http') ? src : `/api/article-image?path=${encodeURIComponent(`${src || ''}`)}`
                  return <img src={imageSrc} alt={alt} {...props} />
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          {post.navigation && (
            <div className={styles.navigation}>
              <div className={styles.navigationLinks}>
                {post.navigation.prev && (
                  <div className={styles.navItem}>
                    <span className={styles.navLabel}>Previous article:</span>
                    <Link href={`/blog/${post.navigation.prev.slug}`} passHref>
                      <span className={styles.prevLink}>{post.navigation.prev.title}</span>
                    </Link>
                  </div>
                )}
                {post.navigation.next && (
                  <div className={styles.navItem}>
                    <span className={styles.navLabel}>Next article:</span>
                    <Link href={`/blog/${post.navigation.next.slug}`} passHref>
                      <span className={styles.nextLink}>{post.navigation.next.title}</span>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/blog/all" passHref>
                <span className={styles.blogIndex}>Blog Index</span>
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
  const files = fs.readdirSync(path.join('articles'))
  
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

// Get the content for a specific blog post
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug
  
  // Get all blog posts
  const files = fs.readdirSync(path.join('articles'))
    .filter(filename => filename.endsWith('.md'))
  const posts = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(
      path.join('articles', filename),
      'utf-8'
    )
    const { data } = matter(markdownWithMeta)
    return {
      slug: filename.replace('.md', ''),
      frontmatter: data
    }
  }).sort((a, b) => {
    // Sort by date in descending order
    return new Date(a.frontmatter.date).getTime() - new Date(b.frontmatter.date).getTime() 
  })

  // Find current post index
  const currentIndex = posts.findIndex(post => post.slug === slug)
  
  // Get navigation data
  const navigation = {
    prev: currentIndex > 0 ? {
      slug: posts[currentIndex - 1].slug,
      title: posts[currentIndex - 1].frontmatter.title
    } : null,
    next: currentIndex < posts.length - 1 ? {
      slug: posts[currentIndex + 1].slug,
      title: posts[currentIndex + 1].frontmatter.title
    } : null
  }

  // Get current post content
  const markdownWithMeta = fs.readFileSync(
    path.join('articles', `${slug}.md`),
    'utf-8'
  )

  const { data: frontmatter, content } = matter(markdownWithMeta)
  
  const serializedFrontmatter = {
    ...frontmatter,
    date: frontmatter.date.toString()
  }

  return {
    props: {
      post: {
        slug,
        frontmatter: serializedFrontmatter,
        content,
        navigation
      }
    }
  }
} 