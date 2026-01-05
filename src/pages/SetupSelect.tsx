// src/pages/SetupSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function SetupSelect() {
  const nav = useNavigate();
  const { masters, setSession, clearPrevStepData } = useAppStore();

  const onPick = (s: string): void => {
    setSession({ setup: s });
    nav("/confirm");
  };

  const onBack = (): void => { clearPrevStepData(7); nav(-1); };

  const colorByLabel: Record<string, string> = {
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

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <div className="container" style={{ width: "100%" }}>
          <h2 style={{ marginBottom: 12, textAlign: "center", color: "#000" }}>仕掛け選択</h2>

          {/* 3列＆正方形 */}
          <div className="grid-3">

            {masters.setups.map((m: string) => {
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
