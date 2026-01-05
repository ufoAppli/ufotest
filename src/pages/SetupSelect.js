import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SetupSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function SetupSelect() {
    const nav = useNavigate();
    const { masters, setSession, clearPrevStepData } = useAppStore();
    const onPick = (s) => {
        setSession({ setup: s });
        nav("/confirm");
    };
    const onBack = () => { clearPrevStepData(7); nav(-1); };
    const colorByLabel = {
        "橋渡し": "btn-green1",
        "山積み/ドカ盛": "btn-green2",
        "スライド/ハの字": "btn-green3",
        "フック/リング/S字": "btn-orange1",
        "Cリング/Dリング": "btn-orange2",
        "リング/ペラ輪": "btn-orange3",
        "鳥よけ/剣山": "btn-glay2",
        "平置き": "btn-glay3",
        "その他": "btn-glay4",
    };
    return (_jsx("div", { className: "page bg-default", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "container", style: { width: "100%" }, children: [_jsx("h2", { style: { marginBottom: 12, textAlign: "center", color: "#000" }, children: "\u4ED5\u639B\u3051\u9078\u629E" }), _jsx("div", { className: "grid-3", children: masters.setups.map((m) => {
                            const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
                            return (_jsx("button", { className: `square-btn ${colorClass}`, onClick: () => onPick(m), "aria-label": m, children: m }, m));
                        }) }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: onBack, children: "\u623B\u308B" }) })] }) }) }));
}
