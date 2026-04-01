import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_LANDSCAPE_HEIGHT_BREAKPOINT = 520
const MOBILE_WIDTH_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const MOBILE_LANDSCAPE_QUERY = `(max-height: ${MOBILE_LANDSCAPE_HEIGHT_BREAKPOINT}px) and (orientation: landscape)`

function getIsMobileSnapshot() {
  if (typeof window === 'undefined') return false

  const widthMql = window.matchMedia(MOBILE_WIDTH_QUERY)
  const landscapeHeightMql = window.matchMedia(MOBILE_LANDSCAPE_QUERY)

  return widthMql.matches || landscapeHeightMql.matches
}

function subscribeToIsMobileChanges(onStoreChange: () => void) {
  const widthMql = window.matchMedia(MOBILE_WIDTH_QUERY)
  const landscapeHeightMql = window.matchMedia(MOBILE_LANDSCAPE_QUERY)

  widthMql.addEventListener('change', onStoreChange)
  landscapeHeightMql.addEventListener('change', onStoreChange)

  return () => {
    widthMql.removeEventListener('change', onStoreChange)
    landscapeHeightMql.removeEventListener('change', onStoreChange)
  }
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribeToIsMobileChanges, getIsMobileSnapshot, () => false)
}
