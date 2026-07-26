import { useState } from "react";
import { useCurryCompanion } from "../hooks/useCurryCompanion.js";
import { useMediaPreference } from "../hooks/useMediaPreference.js";

const ASSET = "/pet/curry-companion.webp";

export default function CurryCompanion({ random = Math.random }) {
  const mobile = useMediaPreference("(max-width: 639px)");
  const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");
  const [assetStatus, setAssetStatus] = useState("loading");
  const motionEligible = assetStatus === "loaded" && !mobile && !reducedMotion;
  const { state, onPointerEnter, onActionEnd } = useCurryCompanion({
    motionEligible,
    random,
  });

  if (assetStatus === "failed") return null;

  return (
    <div
      className="curry-companion"
      aria-hidden="true"
      data-asset-status={assetStatus}
      data-motion={motionEligible ? "eligible" : "static"}
      data-state={motionEligible ? state : "idle"}
      onPointerEnter={motionEligible ? onPointerEnter : undefined}
      onAnimationEnd={(event) => {
        if (
          motionEligible &&
          event.target === event.currentTarget &&
          event.animationName !== "curry-idle"
        ) {
          onActionEnd();
        }
      }}
    >
      <img
        className="curry-companion-preload"
        src={ASSET}
        alt=""
        aria-hidden="true"
        onLoad={() => setAssetStatus("loaded")}
        onError={() => setAssetStatus("failed")}
      />
    </div>
  );
}
