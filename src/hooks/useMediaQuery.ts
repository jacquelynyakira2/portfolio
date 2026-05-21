export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
