import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SizeSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function SizeSelect() {
    const nav = useNavigate();
    const { masters, setSession, clearPrevStepData } = useAppStore();
    const onPick = (s) => {
        setSession({ size: s });
        nav("/setup");
    };
    const onBack = () => { clearPrevStepData(6); nav(-1); };
    const colorByLabel = {
        "小型10以下": "btn-green1",
        "中型10~20": "btn-green2",
        "大型20~30": "btn-green3",
        "超大型30以上": "btn-orange1",
        "その他": "btn-glay4",
    };
    return (_jsx("div", { className: "page bg-default", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "container", style: { width: "100%" }, children: [_jsx("h2", { style: { marginBottom: 12, textAlign: "center", color: "#000" }, children: "\u30D7\u30E9\u30A4\u30BA\u30B5\u30A4\u30BA\u9078\u629E" }), _jsx("div", { className: "grid-3", children: masters.sizes.map((m) => {
                            const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
                            return (_jsx("button", { className: `square-btn ${colorClass}`, onClick: () => onPick(m), "aria-label": m, children: m }, m));
                        }) }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: onBack, children: "\u623B\u308B" }) })] }) }) }));
}
