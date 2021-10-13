import React, { useRef } from "react"

export function useTimer() {
  const timer: React.MutableRefObject<NodeJS.Timeout | undefined> = useRef()

  React.useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])

  return timer
}
