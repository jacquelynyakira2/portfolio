import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";
import type { ReactNode } from "react";

interface ContentProps {
  contentID: string;
  contentURL: string;
  fullWidth?: boolean;
  setFullWidth?: (value: boolean) => void;
  headerRight?: ReactNode;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div
      bg="gray-100 dark:gray-800"
      text="gray-800 dark:gray-100"
      className="h-full flex flex-col"
    >
      <div className="flex-1 overflow-auto px-2 py-3">
        <ul className="space-y-1">
          {bear.map((item, index) => (
            <li
              key={`bear-sidebar-${item.id}`}
              className={`h-8 hstack rounded-md px-3 cursor-default transition-colors ${
                cur === index
                  ? "bg-gray-300/70 dark:bg-gray-700/80 font-semibold"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setMidBar(item.md, index)}
            >
              <span className={`${item.icon} text-c-500`} />
              <span className="ml-2 text-sm">{item.title}</span>
            </li>
          ))}
        </ul>

        {/* Tags section */}
        <div className="mt-6">
          <div className="text-xs font-600 uppercase tracking-wide" text="c-500">
            Tags
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "#ai",
              "#ux",
              "#product",
              "#designsystems",
              "#accessibility",
              "#prototyping",
              "#leadership",
              "#figma",
              "#web",
              "#vibe coding"
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full inline-flex items-center"
                bg="gray-200 dark:gray-700"
                text="gray-700 dark:gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <div className="h-full flex flex-col" bg="gray-50 dark:gray-900">
      <div className="flex-1 overflow-auto px-3 py-3 space-y-2">
        <ul className="space-y-2">
          {items.map((item: BearMdData, index: number) => (
            <li
              key={`bear-midbar-${item.id}`}
              className={`p-3 rounded-lg cursor-default border transition-colors ${
                cur === index
                  ? "bg-yellow-200/60 dark:bg-yellow-500/20 border-yellow-400 dark:border-yellow-600"
                  : "bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setContent(item.id, item.file, index)}
            >
              <div className="hstack items-start">
                <div className="w-8 vstack pt-0.5 text-c-500">
                  <span className={item.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="relative font-600 inline-flex items-center"
                    text="sm gray-900 dark:gray-100"
                  >
                    <span className="mr-2">{item.title}</span>
                    {item.link && (
                      <a
                        className="inline-flex items-center justify-center w-5 h-5 ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open link"
                      >
                        <span className="i-ant-design:link-outlined text-[14px] text-c-500 hover:text-c-700 dark:hover:text-c-300" />
                      </a>
                    )}
                  </div>
                  <div className="line-clamp-2 mt-1" text="xs c-500">
                    {item.excerpt}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const processMarkdownWithHTML = (text: string): string => {
  // Basic markdown to HTML conversion
  const html = text
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    // Links
    .replace(
      /\[([^\]]*)\]\(([^\)]*)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Images
    .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
    // Lists
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    // Line breaks
    .replace(/\n\n/gim, "</p><p>")
    .replace(/\n/gim, "<br />");

  // Wrap in paragraphs but avoid wrapping HTML elements
  const lines = text.split("\n");
  let result = "";
  let inList = false;
  let inHTML = false;

  for (let line of lines) {
    line = line.trim();

    // Check if line contains HTML
    if (line.includes("<iframe") || line.includes("<div") || line.includes("</div>")) {
      inHTML = true;
      result += line + "\n";
      if (line.includes("</div>") || line.includes("</iframe>")) {
        inHTML = false;
      }
      continue;
    }

    // Skip empty lines
    if (!line) {
      if (!inHTML && !inList) result += "</p><p>";
      continue;
    }

    // Handle headers
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, "");
      result += `<h${level}>${text}</h${level}>`;
      continue;
    }

    // Handle lists
    if (line.startsWith("- ")) {
      if (!inList) {
        result += "<ul>";
        inList = true;
      }
      result += `<li>${line.substring(2)}</li>`;
      continue;
    } else if (inList) {
      result += "</ul>";
      inList = false;
    }

    // Handle bold/italic/links
    line = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]*)\]\(([^\)]*)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img alt="$1" src="$2" />');

    // Regular paragraph
    if (!inHTML) {
      result += `<p>${line}</p>`;
    } else {
      result += line + "\n";
    }
  }

  if (inList) result += "</ul>";

  return result;
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({
  contentID,
  contentURL,
  fullWidth = false,
  setFullWidth,
  headerRight
}: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            storeMd[id] = fixImageURL(text, url);
            setStoreMd({ ...storeMd });
          })
          .catch((error) => console.error(error));
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="h-full flex flex-col" bg="gray-50 dark:gray-900">
      <div className="h-10 flex items-start justify-between px-4 pt-1">
        <button
          type="button"
          onClick={() => setFullWidth?.(!fullWidth)}
          className="size-8 flex items-center justify-center border border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          aria-label={fullWidth ? "Show sidebar and list" : "Hide sidebar and list"}
        >
          {/* Use static class names so UnoCSS can tree-shake correctly */}
          {fullWidth ? (
            <span className="i-ic:baseline-fullscreen-exit text-[20px] text-gray-700 dark:text-gray-300" />
          ) : (
            <span className="i-ic:baseline-fullscreen text-[20px] text-gray-700 dark:text-gray-300" />
          )}
        </button>
        {/* Right side header area for full-width navigation */}
        <div className="flex items-center gap-2">{headerRight}</div>
      </div>
      <div className="flex-1 overflow-auto">
        <div
          className={`markdown w-full ${fullWidth ? "px-6" : "pl-12 pr-6"} pt-0 pb-6 ${
            fullWidth ? "max-w-[750px] mx-auto" : ""
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeRaw,
              rehypeKatex,
              [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
            ]}
            components={{
              ...Highlighter(dark as boolean),
              // Allow HTML elements by passing through props
              iframe: ({ node, ...props }) => <iframe {...props} />,
              div: ({ node, ...props }) => <div {...props} />,
              img: ({ node, ...props }) => <img {...props} />
            }}
            skipHtml={false}
          >
            {storeMd[contentID]}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const Bear = () => {
  const [fullWidth, setFullWidth] = useState(false);
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  // Helpers for full-width top navigation
  const goPrev = () => {
    const list = state.midbarList;
    if (!list.length) {
      return;
    }
    const idx = (state.curMidbar - 1 + list.length) % list.length;
    const item = list[idx];
    setContent(item.id, item.file, idx);
  };

  const goNext = () => {
    const list = state.midbarList;
    if (!list.length) {
      return;
    }
    const idx = (state.curMidbar + 1) % list.length;
    const item = list[idx];
    setContent(item.id, item.file, idx);
  };

  useEffect(() => {
    if (!fullWidth) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullWidth, goNext, goPrev]);

  return (
    <div className="bear font-avenir flex h-full" bg="gray-50 dark:gray-900">
      <div
        className={`overflow-auto border-r transition-all duration-300 ease-in-out ${
          fullWidth ? "w-0 opacity-0" : "w-44 opacity-100"
        }`}
        border="c-300 dark:c-700"
      >
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div
        className={`overflow-auto border-r transition-all duration-300 ease-in-out ${
          fullWidth ? "w-0 opacity-0" : "w-66 opacity-100"
        }`}
        border="c-300 dark:c-700"
      >
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <Content
          contentID={state.contentID}
          contentURL={state.contentURL}
          fullWidth={fullWidth}
          setFullWidth={setFullWidth}
          headerRight={
            fullWidth ? (
              <div className="flex items-center gap-2">
                {/* Category selector */}
                <div className="relative rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-600 transition-colors">
                  <select
                    aria-label="Select section"
                    className="h-8 rounded-md border-none bg-transparent px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600 appearance-none pr-8 text-gray-900 dark:text-gray-100"
                    value={state.curSidebar}
                    onChange={(e) => {
                      const idx = +e.target.value;
                      setMidBar(bear[idx].md, idx);
                    }}
                  >
                    {bear.map((b, i) => (
                      <option key={`cat-${b.id}`} value={i} className="text-gray-900">
                        {b.title}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 i-tabler:chevron-down text-[16px] text-c-500" />
                </div>

                {/* Note selector within category */}
                <div className="relative rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-600 transition-colors">
                  <select
                    aria-label="Select note"
                    className="h-8 rounded-md border-none bg-transparent px-2 text-sm max-w-60 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 appearance-none pr-8 text-gray-900 dark:text-gray-100"
                    value={state.curMidbar}
                    onChange={(e) => {
                      const idx = +e.target.value;
                      const item = state.midbarList[idx];
                      setContent(item.id, item.file, idx);
                    }}
                  >
                    {state.midbarList.map((m, i) => (
                      <option key={`note-${m.id}`} value={i} className="text-gray-900">
                        {m.title}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 i-tabler:chevron-down text-[16px] text-c-500" />
                </div>

                {/* Prev / Next */}
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-600"
                  onClick={goPrev}
                  aria-label="Previous"
                >
                  <span className="i-tabler:chevron-left text-[18px] text-gray-900 dark:text-gray-100" />
                </button>
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-600"
                  onClick={goNext}
                  aria-label="Next"
                >
                  <span className="i-tabler:chevron-right text-[18px] text-gray-900 dark:text-gray-100" />
                </button>
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default Bear;
