export interface AppsData {
  id: string;
  title: string;
  desktop: boolean;
  img: string;
  show?: boolean;
  dockHidden?: boolean; // If true, don't show in dock (desktop icon only)
  hideTrafficLights?: boolean; // If true, hide window controls in AppWindow
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  x?: number;
  y?: number;
  content?: JSX.Element;
  link?: string;
}
