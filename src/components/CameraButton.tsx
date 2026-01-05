// src/components/CameraButton.tsx
import { useRef } from "react";
import CameraInput from "./CameraInput";

type CameraButtonProps = {
    makeFileName: () => string;
    className?: string;
    label?: string;
    onSelected?: (file?: File) => void; // ← 既に定義済み
};

export default function CameraButton({
    makeFileName,
    className,
    label = "カメラ起動",
    onSelected,
}: CameraButtonProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openCamera = () => {
    inputRef.current?.click();
    };

    return (
    <div>
        <button type="button" className={className} onClick={openCamera}>
        {label}
        </button>

        <CameraInput
            ref={inputRef}
            makeFileName={makeFileName}
            hidden
            onSelected={onSelected} // ← 追加
        />
    </div>
    );
}