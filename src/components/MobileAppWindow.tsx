import React from "react";
import { useWindowSize } from "~/hooks";

const FullIcon = ({ size }: { size: number }) => (
  <svg
    className="icon"
    viewBox="0 0 13 13"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
  >
    <path d="M9.26 12.03L.006 2.73v9.3H9.26zM2.735.012l9.3 9.3v-9.3h-9.3z" />
  </svg>
);

const ExitFullIcon = ({ size }: { size: number }) => (
  <svg
    className="icon"
    viewBox="0 0 19 19"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
  >
    <path d="M18.373 9.23L9.75.606V9.23h8.624zM.6 9.742l8.623 8.624V9.742H.599z" />
  </svg>
);

interface TrafficProps {
  id: string;
  max: boolean;
  aspectRatio?: number;
  setMax: (id: string, target?: boolean) => void;
  setMin: (id: string) => void;
  close: (id: string) => void;
}

interface MobileWindowProps extends TrafficProps {
  title: string;
  min: boolean;
  z: number;
  focus: (id: string) => void;
  children: React.ReactNode;
}

const TrafficLights = ({ id, close, aspectRatio, max, setMax, setMin }: TrafficProps) => {
  const disableMax = aspectRatio !== undefined;

  const closeWindow = (e: React.MouseEvent | React.TouchEvent): void => {
    e.stopPropagation();
    close(id);
  };

  return (
    <div className="traffic-lights flex flex-row absolute left-0 space-x-2 pl-2 mt-1.5">
      <button
        className="window-btn bg-red-500 dark:bg-red-400"
        onClick={closeWindow}
        onTouchEnd={closeWindow}
      >
        <span className="icon i-gg:close text-[9px]" />
      </button>
      <button
        className={`window-btn ${max ? "bg-c-400" : "bg-yellow-500 dark:bg-yellow-400"}`}
        onClick={() => setMin(id)}
        onTouchEnd={() => setMin(id)}
        disabled={max}
      >
        <span className={`icon i-fe:minus text-[10px] ${max ? "invisible" : ""}`} />
      </button>
      <button
        className={`window-btn ${
          disableMax ? "bg-c-400" : "bg-green-500 dark:bg-green-400"
        }`}
        onClick={() => setMax(id)}
        onTouchEnd={() => setMax(id)}
        disabled={disableMax}
      >
        {!disableMax && (max ? <ExitFullIcon size={9} /> : <FullIcon size={6} />)}
      </button>
    </div>
  );
};

const MobileAppWindow = (props: MobileWindowProps) => {
  const { winWidth, winHeight } = useWindowSize();

  // Mobile windows are always full-screen
  const width = winWidth;
  const height = winHeight;

  // Clone children and pass width prop (same as desktop AppWindow)
  const children = React.cloneElement(props.children as React.ReactElement, {
    width: width
  });

  // Minimized windows are hidden
  const minimized = props.min ? "hidden" : "";

  return (
    <div
      className={`fixed inset-0 flex flex-col bg-c-100 ${minimized}`}
      style={{
        zIndex: props.z,
        top: "32px", // Account for TopBar height (minMarginY)
        height: "calc(100vh - 32px)"
      }}
      onClick={() => props.focus(props.id)}
      id={`window-${props.id}`}
    >
      {/* Window header bar */}
      <div className="window-bar relative h-6 text-center bg-c-200 flex-shrink-0">
        <TrafficLights
          id={props.id}
          max={props.max}
          aspectRatio={props.aspectRatio}
          setMax={props.setMax}
          setMin={props.setMin}
          close={props.close}
        />
        <span className="font-semibold text-c-700">{props.title}</span>
      </div>

      {/* App content - scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
};

export default MobileAppWindow;
