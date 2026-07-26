import { useEffect, useState } from "react";

function readPreference(query) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function useMediaPreference(query) {
  const [matches, setMatches] = useState(() => readPreference(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    if (media.addEventListener) media.addEventListener("change", update);
    else media.addListener(update);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", update);
      else media.removeListener(update);
    };
  }, [query]);

  return matches;
}
