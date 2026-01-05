// src/pages/Top.tsx
import { useNavigate } from "react-router-dom";

export default function Top() {
  const nav = useNavigate();

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <h2 className="page-title" style={{ color: '#000' }}>
          ufo counter
        </h2>

        <div className="btn-col">
          <button
            className="btn-blue btn-lg btn-block"
            onClick={() => nav("/store")}
          >
            カウント開始
          </button>

          <button
            className="btn-pink btn-lg btn-block"
            onClick={() => nav("/stores")}
          >
            データ閲覧
          </button>
        </div>
      </div>
    </div>
  );
}
