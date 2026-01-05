import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Top.tsx
import { useNavigate } from "react-router-dom";
export default function Top() {
    const nav = useNavigate();
    return (_jsx("div", { className: "page bg-default", children: _jsxs("div", { className: "center-wrap", children: [_jsx("h2", { className: "page-title", style: { color: '#000' }, children: "ufo counter" }), _jsxs("div", { className: "btn-col", children: [_jsx("button", { className: "btn-blue btn-lg btn-block", onClick: () => nav("/store"), children: "\u30AB\u30A6\u30F3\u30C8\u958B\u59CB" }), _jsx("button", { className: "btn-pink btn-lg btn-block", onClick: () => nav("/stores"), children: "\u30C7\u30FC\u30BF\u95B2\u89A7" })] })] }) }));
}
