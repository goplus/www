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
    /** source file name */
    file: string
}
  
export interface Article extends ArticleMetadata {
    content: string
}
  
const articlesDirectory = path.join(process.cwd(), "articles")
  
export function getAllArticles(limit?: number): ArticleMetadata[] {
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
      file: fileName
    }
  
    return metadata
  })
  
  const sortedArticles = allArticlesData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime() 
  })

  return limit ? sortedArticles.slice(0, limit) : sortedArticles
}
  
export async function getArticleData(slug: string): Promise<Article> {
  const fileName = `${slug}.md`
  const fullPath = path.join(articlesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  
  const matterResult = matter(fileContents)
  
  const article: Article = {
    title: matterResult.data.title,
    date: matterResult.data.date.toString(),
    by: matterResult.data.by,
    summary: matterResult.data.summary,
    file: fileName,
    content: matterResult.content
  }
  
  return article
} 



