import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/PrizeSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function PrizeSelect() {
    const nav = useNavigate();
    const { masters, setSession, clearPrevStepData } = useAppStore();
    const onPick = (p) => {
        setSession({ prize: p });
        nav("/size");
    };
    const onBack = () => { clearPrevStepData(5); nav(-1); };
    const colorByLabel = {
        "ぬい": "btn-green1",
        "フィギュア（箱）": "btn-green2",
        "食品（箱）": "btn-green3",
        "食品（非箱）": "btn-orange1",
        "雑貨（箱）": "btn-orange2",
        "雑貨（非箱）": "btn-orange3",
        "その他": "btn-glay4",
    };
    return (_jsx("div", { className: "page bg-default", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "container", style: { width: "100%" }, children: [_jsx("h2", { style: { marginBottom: 12, textAlign: "center", color: "#000" }, children: "\u30D7\u30E9\u30A4\u30BA\u7A2E\u985E\u9078\u629E" }), _jsx("div", { className: "grid-3", children: masters.prizes.map((m) => {
                            const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
                            return (_jsx("button", { className: `square-btn ${colorClass}`, onClick: () => onPick(m), "aria-label": m, children: m }, m));
                        }) }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: onBack, children: "\u623B\u308B" }) })] }) }) }));
}
