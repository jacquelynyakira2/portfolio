import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";
import Notes from "~/components/apps/Notes";
import Typora from "~/components/apps/Typora";
import Safari from "~/components/apps/Safari";
import VSCode from "~/components/apps/VSCode";
import FaceTime from "~/components/apps/FaceTime";
import Terminal from "~/components/apps/Terminal";
import DesktopFolder from "~/components/apps/DesktopFolder";
import Trash from "~/components/apps/Trash";
import Preview from "~/components/apps/Preview";

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "bear",
    title: "Notes",
    desktop: true,
    width: 860,
    height: 500,
    show: true,
    y: -40,
    img: "img/icons/notes.png",
    content: <Notes />
  },
  {
    id: "typora",
    title: "Typora",
    desktop: true,
    width: 600,
    height: 580,
    y: -20,
    img: "img/icons/typora.png",
    content: <Typora />
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: <Safari />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "desktop-folder",
    title: "desktop",
    desktop: true, // Can be opened as a window
    dockHidden: true, // Don't show in dock
    width: 800,
    height: 420,
    x: 0,
    y: 0,
    img: "img/icons/Folder.png",
    content: <DesktopFolder />
  },
  {
    id: "figma",
    title: "Figma",
    desktop: false, // opens in a new tab
    img: "img/icons/figma.png", // temporary icon; swap to "img/icons/figma.png" later
    link: "https://www.figma.com/"
  },
  {
    id: "medium",
    title: "Medium",
    desktop: false,
    img: "img/icons/medium.png", // temporary; swap to img/icons/medium.png later
    link: "https://medium.com/@jacquelynyakira"
  },
  {
    id: "threads",
    title: "Threads",
    desktop: false,
    img: "img/icons/threads.png",
    link: "https://www.threads.com/@jacquelynyakira"
  },
  {
    id: "dribbble",
    title: "Dribbble",
    desktop: false,
    img: "img/icons/dribbble.png",
    link: "https://dribbble.com/Jacquelynyakira"
  },
  {
    id: "trash",
    title: "Trash",
    desktop: true,
    width: 800,
    height: 500,
    img: "img/icons/trash-full.png",
    content: <Trash />
  },
  {
    id: "preview",
    title: "Preview",
    desktop: true,
    dockHidden: true, // Don't show in dock - opened programmatically from Trash
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    img: "img/icons/folder.png", // placeholder icon
    content: <Preview />
  }
];

export default apps;
