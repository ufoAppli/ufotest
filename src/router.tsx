// src/router.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Top from "./pages/Top";
import StoreName from "./pages/StoreName";
import MachineSelect from "./pages/MachineSelect";
import PrizeSelect from "./pages/PrizeSelect";
import SizeSelect from "./pages/SizeSelect";
import SetupSelect from "./pages/SetupSelect";
import ConfirmEntry from "./pages/ConfirmEntry";
import StoreList from "./pages/StoreList";
import StoreDetail from "./pages/StoreDetail";
import DeleteConfirm from "./pages/DeleteConfirm";

function RouterDebugBar() {
  const loc = useLocation();
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#222', color: '#fff', padding: '6px 10px',
      fontSize: 12, zIndex: 9999
    }}>
      <span>location.pathname: <b>{loc.pathname}</b></span>
    </div>
  );
}

export function RouterView() {
  console.log(">>> render RouterView");
  return (
    <>
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/store" element={<StoreName />} />
      <Route path="/machine" element={<MachineSelect />} />
      <Route path="/prize" element={<PrizeSelect />} />
      <Route path="/size" element={<SizeSelect />} />
      <Route path="/setup" element={<SetupSelect />} />
      <Route path="/confirm" element={<ConfirmEntry />} />
      <Route path="/stores" element={<StoreList />} />
      <Route path="/stores/:id" element={<StoreDetail />} />
      <Route path="/delete" element={<DeleteConfirm />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <RouterDebugBar />
    </>
  );
}
