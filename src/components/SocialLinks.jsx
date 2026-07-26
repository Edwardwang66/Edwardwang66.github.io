import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMediaPreference } from "../hooks/useMediaPreference.js";
import SafeImage from "./SafeImage.jsx";
import { socialIcons } from "./socialIcons.js";

function cardId(label) {
  return `social-profile-card-${label.toLowerCase()}`;
}

function triggerId(label) {
  return `social-profile-trigger-${label.toLowerCase()}`;
}

export default function SocialLinks({
  socials,
  listClassName = "hero-socials",
}) {
  const profiles = useMemo(
    () => socials.filter(({ kind }) => kind === "profile-card"),
    [socials]
  );
  const hoverCapable = useMediaPreference(
    "(hover: hover) and (pointer: fine)"
  );
  const [activeLabel, setActiveLabel] = useState(null);
  const [cardLeft, setCardLeft] = useState({});
  const rootRef = useRef(null);
  const triggerRefs = useRef(new Map());
  const cardRefs = useRef(new Map());
  const pointerFocusLabel = useRef(null);
  const focusOwnedLabel = useRef(null);
  const restoredFocusLabel = useRef(null);

  const setTriggerRef = useCallback((label, node) => {
    if (node) triggerRefs.current.set(label, node);
    else triggerRefs.current.delete(label);
  }, []);

  const setCardRef = useCallback((label, node) => {
    if (node) cardRefs.current.set(label, node);
    else cardRefs.current.delete(label);
  }, []);

  useLayoutEffect(() => {
    if (!activeLabel) return undefined;

    const measure = () => {
      const root = rootRef.current;
      const trigger = triggerRefs.current.get(activeLabel);
      const card = cardRefs.current.get(activeLabel);
      if (!root || !trigger || !card) return;

      const rootRect = root.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const width = Math.min(card.offsetWidth, rootRect.width);
      const ideal =
        triggerRect.left -
        rootRect.left +
        triggerRect.width / 2 -
        width / 2;
      const left = Math.max(0, Math.min(ideal, rootRect.width - width));
      setCardLeft((current) => ({ ...current, [activeLabel]: left }));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeLabel]);

  useEffect(() => {
    if (!activeLabel) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        focusOwnedLabel.current = null;
        setActiveLabel(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      const trigger = triggerRefs.current.get(activeLabel);
      restoredFocusLabel.current =
        trigger && document.activeElement !== trigger ? activeLabel : null;
      focusOwnedLabel.current = null;
      setActiveLabel(null);
      trigger?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeLabel]);

  return (
    <div
      ref={rootRef}
      className="social-links"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          focusOwnedLabel.current = null;
          setActiveLabel(null);
        }
      }}
      onPointerLeave={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          hoverCapable &&
          !(
            nextTarget instanceof Node &&
            event.currentTarget.contains(nextTarget)
          ) &&
          focusOwnedLabel.current !== activeLabel
        ) {
          setActiveLabel(null);
        }
      }}
    >
      <ul className={listClassName} aria-label="Profile links">
        {socials.map((social) => {
          const Icon = socialIcons[social.icon];
          if (social.kind === "link") {
            const external = social.href.startsWith("http");
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onFocus={() => {
                    focusOwnedLabel.current = null;
                    setActiveLabel(null);
                  }}
                  onPointerEnter={() => {
                    if (hoverCapable) setActiveLabel(null);
                  }}
                >
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  <span>{social.label}</span>
                </a>
              </li>
            );
          }

          const expanded = activeLabel === social.label;
          return (
            <li key={social.label}>
              <button
                ref={(node) => setTriggerRef(social.label, node)}
                id={triggerId(social.label)}
                type="button"
                aria-expanded={expanded}
                aria-controls={cardId(social.label)}
                onPointerDown={() => {
                  pointerFocusLabel.current = social.label;
                  focusOwnedLabel.current = null;
                }}
                onFocus={() => {
                  if (restoredFocusLabel.current === social.label) {
                    restoredFocusLabel.current = null;
                    return;
                  }
                  if (pointerFocusLabel.current === social.label) {
                    pointerFocusLabel.current = null;
                    return;
                  }
                  focusOwnedLabel.current = social.label;
                  setActiveLabel(social.label);
                }}
                onPointerEnter={() => {
                  if (hoverCapable) setActiveLabel(social.label);
                }}
                onClick={() => {
                  pointerFocusLabel.current = null;
                  if (!hoverCapable) {
                    setActiveLabel((current) =>
                      current === social.label ? null : social.label
                    );
                  }
                }}
              >
                {Icon ? <Icon aria-hidden="true" /> : null}
                <span>{social.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {profiles.map((social) => {
        const open = activeLabel === social.label;
        return (
          <section
            ref={(node) => setCardRef(social.label, node)}
            key={social.label}
            id={cardId(social.label)}
            className="social-profile-card"
            role="region"
            aria-labelledby={triggerId(social.label)}
            aria-hidden={!open}
            data-state={open ? "open" : "closed"}
            style={{
              "--social-card-left": `${cardLeft[social.label] ?? 0}px`,
            }}
          >
            <SafeImage
              {...social.image}
              loading="lazy"
              fallbackLabel="Image unavailable"
            />
            <div className="social-profile-copy">
              <p>{social.label}</p>
              <strong>{social.displayName}</strong>
              <span>{social.accountId}</span>
            </div>
          </section>
        );
      })}
    </div>
  );
}
