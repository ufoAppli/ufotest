import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/MachineSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function MachineSelect() {
    const nav = useNavigate();
    const { masters, setSession, clearPrevStepData } = useAppStore();
    // ✅ 引数 s に string 型を明示
    const onPick = (s) => {
        setSession({ machine: s });
        nav("/prize");
    };
    const onBack = () => {
        // 画面4 → 戻る → 画面3（店舗名破棄＆店舗自体も削除）
        clearPrevStepData(4);
        nav(-1);
    };
    const colorByLabel = {
        "2本爪 中型": "btn-green1",
        "2本爪 小型": "btn-green2",
        "3本爪 超小型": "btn-orange1",
        "3本爪 小型": "btn-orange2",
        "3本爪 中型": "btn-orange3",
        "3本爪 大型": "btn-orange4",
        "特殊": "btn-glay3",
        "その他": "btn-glay4",
    };
    return (_jsx("div", { className: "page bg-default", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "container", style: { width: "100%" }, children: [_jsx("h2", { style: { marginBottom: 12, textAlign: "center", color: "#000" }, children: "\u6A5F\u7A2E\u9078\u629E" }), _jsx("div", { className: "grid-3", children: masters.machines.map((m) => {
                            const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
                            return (_jsx("button", { className: `square-btn ${colorClass}`, onClick: () => onPick(m), "aria-label": m, children: m }, m));
                        }) }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: onBack, children: "\u623B\u308B" }) })] }) }) }));
}
