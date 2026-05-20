export function useWindowSize() {
  const getWindowSize = () => ({
    winWidth: window.visualViewport?.width ?? window.innerWidth,
    winHeight: window.visualViewport?.height ?? window.innerHeight
  });

  const [state, setState] = useState({
    ...getWindowSize()
  });

  useEffect(() => {
    const handler = () => {
      setState(getWindowSize());
    };

    window.addEventListener("resize", handler);
    window.visualViewport?.addEventListener("resize", handler);
    window.visualViewport?.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("resize", handler);
      window.visualViewport?.removeEventListener("resize", handler);
      window.visualViewport?.removeEventListener("scroll", handler);
    };
  }, []);

  return state;
}
