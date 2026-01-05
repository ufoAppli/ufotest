import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/router.tsx
import { Routes, Route, Navigate } from "react-router-dom";
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
export function RouterView() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Top, {}) }), _jsx(Route, { path: "/store", element: _jsx(StoreName, {}) }), _jsx(Route, { path: "/machine", element: _jsx(MachineSelect, {}) }), _jsx(Route, { path: "/prize", element: _jsx(PrizeSelect, {}) }), _jsx(Route, { path: "/size", element: _jsx(SizeSelect, {}) }), _jsx(Route, { path: "/setup", element: _jsx(SetupSelect, {}) }), _jsx(Route, { path: "/confirm", element: _jsx(ConfirmEntry, {}) }), _jsx(Route, { path: "/stores", element: _jsx(StoreList, {}) }), _jsx(Route, { path: "/stores/:id", element: _jsx(StoreDetail, {}) }), _jsx(Route, { path: "/delete", element: _jsx(DeleteConfirm, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }));
}
