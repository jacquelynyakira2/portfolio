import { useMotionValue } from "framer-motion";
import { apps } from "~/configs";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  showLaunchpad: boolean;
  toggleLaunchpad: (target: boolean) => void;
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  showLaunchpad,
  toggleLaunchpad,
  hide
}: DockProps) {
  const isPhone = useIsPhone();
  const { dockSize, dockMag } = useStore((state) => ({
    dockSize: state.dockSize,
    dockMag: state.dockMag
  }));

  const openApp = (id: string) => {
    if (id === "launchpad") toggleLaunchpad(!showLaunchpad);
    else {
      toggleLaunchpad(false);
      open(id);
    }
  };

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div
      className={`dock fixed inset-x-0 mx-auto bottom-1 ${hide ? "z-0" : "z-50"}`}
      w="full sm:max"
      overflow="visible"
    >
      <ul
        className="flex px-2 backdrop-blur-2xl bg-c-white/20"
        border="~ c-400/40 rounded-xl"
        onMouseMove={(e) => {
          if (!isPhone) mouseX.set(e.nativeEvent.x);
        }}
        onMouseLeave={() => mouseX.set(null)}
        style={{
          height: `${(dockSize + 15) / 16}rem`,
          gap: isPhone ? "0.5rem" : "0.75rem",
          maxWidth: isPhone ? "calc(100vw - 1rem)" : undefined,
          overflowX: isPhone ? "auto" : "visible",
          overflowY: "visible",
          WebkitOverflowScrolling: isPhone ? "touch" : undefined,
          overscrollBehaviorX: isPhone ? "contain" : undefined
        }}
      >
        {apps
          .filter((app) => !app.dockHidden)
          .map((app) => (
            <DockItem
              key={`dock-${app.id}`}
              id={app.id}
              title={app.title}
              img={app.img}
              mouseX={mouseX}
              desktop={app.desktop}
              openApp={openApp}
              isOpen={app.desktop && showApps[app.id]}
              link={app.link}
              dockSize={dockSize}
              dockMag={isPhone ? 1 : dockMag}
            />
          ))}
      </ul>
    </div>
  );
}
