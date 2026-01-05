import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/CameraButton.tsx
import { useRef } from "react";
import CameraInput from "./CameraInput";
export default function CameraButton({ makeFileName, className, label = "カメラ起動", onSelected, }) {
    const inputRef = useRef(null);
    const openCamera = () => {
        inputRef.current?.click();
    };
    return (_jsxs("div", { children: [_jsx("button", { type: "button", className: className, onClick: openCamera, children: label }), _jsx(CameraInput, { ref: inputRef, makeFileName: makeFileName, hidden: true, onSelected: onSelected })] }));
}
