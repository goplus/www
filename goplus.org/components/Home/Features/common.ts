/** Get anchor ID from title */
export function getAnchorId(title: string) {
  return title
    .split(/[^\w\d\s]/, 1)[0]
    .trim()
    .split(/\s+/)
    .map(word => word.toLocaleLowerCase())
    .join('-')
}
