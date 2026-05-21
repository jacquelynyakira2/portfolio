export function useWindowSize() {
  const getWindowSize = () => {
    const viewport = window.visualViewport;

    return {
      winWidth: viewport?.width ?? window.innerWidth,
      winHeight: viewport?.height ?? window.innerHeight,
      layoutWidth: window.innerWidth,
      layoutHeight: window.innerHeight,
      viewportOffsetLeft: viewport?.offsetLeft ?? 0,
      viewportOffsetTop: viewport?.offsetTop ?? 0
    };
  };

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
