import React from "react";
import { format } from "date-fns";
import { apps, launchpadApps } from "~/configs";
import type { LaunchpadData, AppsData } from "~/types";

const APPS: { [key: string]: (LaunchpadData | AppsData)[] } = {
  app: apps,
  portfolio: launchpadApps
};

const getRandom = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const timeStamp = new Date().getTime();
  const randomStamp = getRandom(0, timeStamp);
  const date = format(randomStamp, "MM/dd/yyyy");
  return date;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  toggleLaunchpad: (target: boolean) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function Spotlight({
  toggleSpotlight,
  openApp,
  toggleLaunchpad,
  btnRef
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [clickedID, setClickedID] = useState("");
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [curDetails, setCurDetails] = useState<any>(null);

  const [appIdList, setAppIdList] = useState<string[]>([]);
  const [appList, setAppList] = useState<JSX.Element | null>(null);

  const textWhite = "text-white";
  const textBlack = "text-c-black";
  /** macOS Spotlight selection */
  const textSelected = "bg-[#007AFF]";

  useClickOutside(spotlightRef, toggleSpotlight, [btnRef]);

  useEffect(() => {
    updateAppList();
  }, [searchText]);

  useEffect(() => {
    updateCurrentDetails();
  }, [selectedIndex]);

  useEffect(() => {
    if (appIdList.length === 0) return;
    // find app's index given its id
    const newSelectedIndex = appIdList.findIndex((item) => {
      return item === clickedID;
    });
    // update index
    updateHighlight(selectedIndex, newSelectedIndex);
    setSelectedIndex(newSelectedIndex);
  }, [clickedID]);

  useEffect(() => {
    if (doubleClicked) {
      launchSelectedApp();
      setDoubleClicked(false);
    }
  }, [doubleClicked]);

  const search = (type: string) => {
    if (searchText === "") return [];

    const text = searchText.toLowerCase();
    return APPS[type].filter(
      (item: LaunchpadData | AppsData) =>
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  };

  const handleClick = (id: string) => {
    setClickedID(id);
  };

  const handleDoubleClick = (id: string) => {
    setClickedID(id);
    setDoubleClicked(true);
  };

  const launchSelectedApp = () => {
    if (curDetails.type === "app" && !curDetails.link) {
      const id = curDetails.id;
      if (id === "launchpad") toggleLaunchpad(true);
      else openApp(id);
      toggleSpotlight();
    } else {
      window.open(curDetails.link);
      toggleSpotlight();
    }
  };

  const getTypeAppList = (type: string, startIndex: number) => {
    const result = search(type);
    const typeAppList = [];
    const typeAppIdList = [];

    for (const app of result) {
      const curIndex = startIndex + typeAppList.length;
      const bg = curIndex === 0 ? textSelected : "bg-transparent";
      const text = curIndex === 0 ? textWhite : textBlack;

      if (curIndex === 0) setCurrentDetailsWithType(app, type);

      typeAppList.push(
        <li
          id={`spotlight-${app.id}`}
          key={`spotlight-${app.id}`}
          className={`hstack h-8 w-full shrink-0 items-center gap-2 rounded-sm px-1.5 ${bg} ${text} cursor-default select-none`}
          data-app-type={type}
          onClick={() => handleClick(app.id)}
          onDoubleClick={() => handleDoubleClick(app.id)}
        >
          <div className="flex size-5 shrink-0 items-center justify-center">
            <img
              className="size-4 shrink-0 object-contain"
              src={app.img}
              alt={app.title}
              title={app.title}
            />
          </div>
          <div className="min-w-0 flex-1 truncate text-[13px] leading-tight">
            {app.title}
          </div>
        </li>
      );
      typeAppIdList.push(app.id);
    }

    return {
      appList: typeAppList,
      appIdList: typeAppIdList
    };
  };

  const updateAppList = () => {
    const app = getTypeAppList("app", 0);
    const portfolio = getTypeAppList("portfolio", app.appIdList.length);

    const newAppIdList = [...app.appIdList, ...portfolio.appIdList];
    // don't show app details when there is no associating app
    if (newAppIdList.length === 0) setCurDetails(null);

    const newAppList = (
      <div>
        {app.appList.length !== 0 && (
          <div>
            <div className="spotlight-type">Applications</div>
            <ul className="w-full">{app.appList}</ul>
          </div>
        )}
        {portfolio.appList.length !== 0 && (
          <div className="mt-2 border-t border-menu pt-1">
            <div className="spotlight-type">Portfolio</div>
            <ul className="w-full">{portfolio.appList}</ul>
          </div>
        )}
      </div>
    );

    setAppIdList(newAppIdList);
    setAppList(newAppList);
  };

  const setCurrentDetailsWithType = (app: any, type: string) =>
    setCurDetails({
      ...app,
      type
    });

  const updateCurrentDetails = () => {
    if (appIdList.length === 0 || searchText === "") {
      setCurDetails(null);
      return;
    }

    const appId = appIdList[selectedIndex];
    const element = document.querySelector(`#spotlight-${appId}`) as HTMLElement;
    const type = element.dataset.appType as string;
    const app = APPS[type].find((item: LaunchpadData | AppsData) => item.id === appId);

    setCurrentDetailsWithType(app, type);
  };

  const updateHighlight = (prevIndex: number, curIndex: number) => {
    if (appIdList.length === 0) return;

    // remove highlight
    const prevAppId = appIdList[prevIndex];
    const prev = document.querySelector(`#spotlight-${prevAppId}`) as HTMLElement;
    prev.className = prev.className
      .replace(textWhite, textBlack)
      .replace(textSelected, "bg-transparent");

    // add highlight
    const curAppId = appIdList[curIndex];
    const cur = document.querySelector(`#spotlight-${curAppId}`) as HTMLElement;
    cur.className = cur.className
      .replace(textBlack, textWhite)
      .replace("bg-transparent", textSelected);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keyCode = e.key;
    const numApps = appIdList.length;

    // ----------- select next app -----------
    if (keyCode === "ArrowDown" && selectedIndex < numApps - 1) {
      updateHighlight(selectedIndex, selectedIndex + 1);
      setSelectedIndex(selectedIndex + 1);
    }
    // ----------- select previous app -----------
    else if (keyCode === "ArrowUp" && selectedIndex > 0) {
      updateHighlight(selectedIndex, selectedIndex - 1);
      setSelectedIndex(selectedIndex - 1);
    }
    // ----------- launch app -----------
    else if (keyCode === "Enter") {
      if (!curDetails) return;
      launchSelectedApp();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update highlighted line
    updateHighlight(selectedIndex, 0);
    // current selected id go back to 0
    setSelectedIndex(0);
    // update search text and associating app list
    setSearchText(e.target.value);
  };

  return (
    <div
      className="spotlight"
      onKeyDown={handleKeyPress}
      onClick={() => inputRef.current?.focus()}
      ref={spotlightRef}
    >
      <div
        className="w-full h-12 sm:h-14 rounded-lg bg-transparent"
        grid="~ cols-8 sm:cols-11"
      >
        <div className="col-start-1 col-span-1 flex-center">
          <span className="i-bx:search ml-1 text-c-600 text-[28px]" />
        </div>
        <input
          ref={inputRef}
          className={`col-start-2 col-span-7 ${
            curDetails ? "sm:col-span-9" : "sm:col-span-10"
          } bg-transparent no-outline px-1`}
          text="c-black xl sm:2xl"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={handleInputChange}
          autoFocus={true}
        />
        {curDetails && (
          <div className="hidden sm:flex col-start-11 col-span-1 flex-center pr-0.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-c-200/90 ring-1 ring-black/5 dark:ring-white/10">
              <img
                className="size-7 shrink-0 object-contain"
                src={curDetails.img}
                alt={curDetails.title}
                title={curDetails.title}
              />
            </div>
          </div>
        )}
      </div>
      {searchText !== "" && (
        <div className="flex min-h-0 h-85 border-t border-menu bg-transparent">
          <div className="w-[40%] min-w-[11.5rem] max-w-[20rem] shrink-0 overflow-y-auto border-r border-menu py-2 pl-2.5 pr-2">
            {appList}
          </div>
          {curDetails && (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 flex-col items-center px-5 pb-1 pt-4">
                <img
                  className="size-18 max-h-18 max-w-full shrink-0 object-contain"
                  src={curDetails.img}
                  alt={curDetails.title}
                  title={curDetails.title}
                />
                <div className="mt-2 text-center text-xl font-semibold leading-snug tracking-tight text-c-black">
                  {curDetails.title}
                </div>
                <div className="mt-0.5 text-center text-xs text-c-500">
                  {`Version: ${getRandom(0, 99)}.${getRandom(0, 999)}`}
                </div>
                <div
                  className="mt-3 w-3/5 max-w-[13rem] shrink-0 border-b border-menu"
                  aria-hidden
                />
              </div>
              <div className="flex min-h-0 flex-1 justify-center overflow-y-auto overscroll-contain px-5 py-3 text-xs">
                <div className="flex w-max gap-4">
                  <div className="w-28 shrink-0 space-y-1 text-right text-c-500">
                    <div>Kind</div>
                    <div>Size</div>
                    <div>Created</div>
                    <div>Modified</div>
                    <div>Last opened</div>
                  </div>
                  <div className="shrink-0 space-y-1 text-left text-c-black">
                    <div>{curDetails.type === "app" ? "Application" : "Portfolio"}</div>
                    <div>{`${getRandom(0, 999)} G`}</div>
                    <div>{getRandomDate()}</div>
                    <div>{getRandomDate()}</div>
                    <div>{getRandomDate()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
