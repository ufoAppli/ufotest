// src/pages/SizeSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function SizeSelect() {
  const nav = useNavigate();
  const { masters, setSession, clearPrevStepData } = useAppStore();

  const onPick = (s: string): void => {
    setSession({ size: s });
    nav("/setup");
  };

  const onBack = (): void => { clearPrevStepData(6); nav(-1); };

  const colorByLabel: Record<string, string> = {
  "小型10以下": "btn-green1",
  "中型10~20": "btn-green2",
  "大型20~30": "btn-green3",
  "超大型30以上": "btn-orange1",
  "その他": "btn-glay4",
  };

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <div className="container" style={{ width: "100%" }}>
          <h2 style={{ marginBottom: 12, textAlign: "center", color: "#000"}}>プライズサイズ選択</h2>

          {/* 3列＆正方形 */}
          <div className="grid-3">

            {masters.sizes.map((m: string) => {
              const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
              return (
                <button
                  key={m}
                  className={`square-btn ${colorClass}`}
                  onClick={() => onPick(m)}
                  aria-label={m}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn-md btn-block btn-glay3" onClick={onBack}>
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
