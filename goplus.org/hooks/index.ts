import React, { useCallback, useRef, useState } from "react"

export function useTimer() {
  const timer: React.MutableRefObject<NodeJS.Timeout | undefined> = useRef()

  React.useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])

  return timer
}

export function useHoverState() {
  const [isHovered, setIsHovered] = useState(false)
  const onMouseEnter = useCallback(() => setIsHovered(true), [])
  const onMouseLeave = useCallback(() => setIsHovered(false), [])
  return {
    isHovered,
    setIsHovered,
    onMouseEnter,
    onMouseLeave
  }
}
