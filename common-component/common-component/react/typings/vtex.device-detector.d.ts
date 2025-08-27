declare module 'vtex.device-detector' {
  export function useDevice(): {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }
}
