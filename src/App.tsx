
// src/App.tsx
import { useEffect } from "react";
import { RouterView } from "./router";
import { useAppStore } from "./store/appStore";
import type { AppState } from "./store/appStore";
import { fetchMasters } from "./services/masters";
import './styles.css';

export default function App() {
  const init = useAppStore((s: AppState) => s.init);

  useEffect(() => {
    (async () => {
      const masters = await fetchMasters();
      await init(masters);
    })();
  }, [init]);

  return <RouterView />;
}

