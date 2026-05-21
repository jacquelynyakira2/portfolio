export function useIsMobile(breakpoint = 768): boolean {
  const smallScreen = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const noHover = useMediaQuery("(hover: none)");

  return smallScreen || (coarsePointer && noHover);
}
