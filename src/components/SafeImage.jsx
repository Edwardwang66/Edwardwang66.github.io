import { useState } from "react";

function ImageAttempt({
  fallbackLabel = "Image unavailable",
  className = "",
  style,
  onError,
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`media-fallback ${className}`.trim()}
        role="img"
        aria-label={`${imageProps.alt} — ${fallbackLabel}`}
        style={{
          aspectRatio: `${imageProps.width} / ${imageProps.height}`,
          ...style,
        }}
      >
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      {...imageProps}
      className={className}
      style={style}
      decoding="async"
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
    />
  );
}

export default function SafeImage(props) {
  return <ImageAttempt key={props.src} {...props} />;
}
