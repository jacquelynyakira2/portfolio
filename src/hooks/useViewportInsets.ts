const readSafeAreaInset = (name: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useViewportInsets() {
  const { winWidth, winHeight } = useWindowSize();

  return useMemo(
    () => ({
      safeTop: readSafeAreaInset("--safe-area-inset-top"),
      safeRight: readSafeAreaInset("--safe-area-inset-right"),
      safeBottom: readSafeAreaInset("--safe-area-inset-bottom"),
      safeLeft: readSafeAreaInset("--safe-area-inset-left")
    }),
    [winWidth, winHeight]
  );
}
