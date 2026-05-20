export function useIsPhone(breakpoint = 640): boolean {
  const smallScreen = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);

  return smallScreen;
}
