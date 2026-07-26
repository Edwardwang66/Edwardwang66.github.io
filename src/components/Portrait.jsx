import { profile } from "../data/portfolio.js";
import SafeImage from "./SafeImage.jsx";

export default function Portrait({ size }) {
  return (
    <figure className="portrait" data-size={size}>
      <SafeImage
        src={profile.portrait.src}
        alt={profile.portrait.alt}
        width={profile.portrait.width}
        height={profile.portrait.height}
        loading={size === "hero" ? "eager" : "lazy"}
        className="portrait-image"
        style={{ objectFit: "cover", objectPosition: "center 32%" }}
        fallbackLabel="Portrait unavailable"
      />
      <span className="portrait-edge" aria-hidden="true" />
    </figure>
  );
}
