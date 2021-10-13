/** 判断当前是否在浏览器中执行，与之对应的是在 Node.js 环境执行（生成静态页面时） */
export function isBrowser() {
  // https://github.com/zeit/next.js/issues/5354#issuecomment-520305040
  return typeof window !== 'undefined'
}
