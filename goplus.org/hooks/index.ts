import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { matchMediaMobile } from '../utils'

export function useTimer() {
  const timer = useRef<NodeJS.Timeout>()

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

/** Use is-mobile info based on media-query match */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const matched = matchMediaMobile()
    setIsMobile(matched.matches)
    function handleMatchedChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches)
    }
    matched.addEventListener('change', handleMatchedChange)
    return () => matched.removeEventListener('change', handleMatchedChange)
  }, [])
  return isMobile
}
