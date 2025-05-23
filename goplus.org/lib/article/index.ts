import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ArticleMetadata {
    title: string
    /** YYYY-MM-DD HH:mm±HH:mm */
    date: string
    /** author list */
    by: string[]
    /** summary */
    summary: string
    /** slug */
    slug: string
}
export interface Article extends ArticleMetadata {
    content: string
}

export interface ArticleNavigation {
  prev:{ slug: string,title: string } | null
  next:{ slug: string,title: string } | null
}

interface ArticleInfo {
  article: Article,
  navigation: ArticleNavigation
}
interface ArticleCache{
  articles: ArticleMetadata[]
  fullArticles: Record<string,ArticleInfo>
}
  
const articlesDirectory = path.join(process.cwd(), "articles")

let cache: ArticleCache = {
  articles: [],
  fullArticles: {}
}

export function getAllArticles(limit?: number): ArticleMetadata[] {
  if (cache.articles.length === 0){
    const fileNames = fs
      .readdirSync(articlesDirectory)
      .filter((fileName) => fileName.endsWith(".md"))
    
    const allArticlesData = fileNames.map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)
      
      const metadata: ArticleMetadata = {
        title: matterResult.data.title,
        date: matterResult.data.date.toString(),
        by: matterResult.data.by,
        summary: matterResult.data.summary,
        slug:fileName.replace(/\.md$/, ""),
      }

      cache.fullArticles[metadata.slug]={
        article:{
          ...metadata,
          content: matterResult.content
        },
        navigation:{
          prev:null,
          next:null,
        }
      }
      return metadata
    })
  
    cache.articles = allArticlesData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime() 
    })

    cache.articles.map((article,index)=>{
      cache.fullArticles[article.slug].navigation = {
        prev:index<cache.articles.length-1?{
          slug:cache.articles[index+1].slug,
          title:cache.articles[index+1].title
        }:null,
        next:index>0?{
          slug:cache.articles[index-1].slug,
          title:cache.articles[index-1].title
        }:null,
      }
    })
  }
  return limit ? cache.articles.slice(0, limit) : cache.articles
}

export function getArticleData(slug: string): ArticleInfo {
  if (Object.keys(cache.fullArticles).length === 0){
    getAllArticles()
  }
  return cache.fullArticles[slug]
} 
