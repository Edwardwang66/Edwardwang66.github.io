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

const CARD_GAP = 8;
const VISIBLE_TOP_GAP = 8;
const INSTANCE_OPEN_EVENT = "social-links:profile-open";

function cardId(label, idPrefix) {
  return `${idPrefix}social-profile-card-${label.toLowerCase()}`;
}

function triggerId(label, idPrefix) {
  return `${idPrefix}social-profile-trigger-${label.toLowerCase()}`;
}

export default function SocialLinks({
  socials,
  listClassName = "hero-socials",
  profileCardPlacement = "auto",
  idPrefix = "",
}) {
  const profiles = useMemo(
    () => socials.filter(({ kind }) => kind === "profile-card"),
    [socials]
  );
  const hoverCapable = useMediaPreference(
    "(hover: hover) and (pointer: fine)"
  );
  const [activeLabel, setActiveLabel] = useState(null);
  const [cardLayouts, setCardLayouts] = useState({});
  const rootRef = useRef(null);
  const triggerRefs = useRef(new Map());
  const cardRefs = useRef(new Map());
  const pointerFocusLabel = useRef(null);
  const focusOwnedLabel = useRef(null);
  const restoredFocusLabel = useRef(null);

  const openProfile = useCallback((label) => {
    rootRef.current?.dispatchEvent(
      new CustomEvent(INSTANCE_OPEN_EVENT, { bubbles: true })
    );
    setActiveLabel(label);
  }, []);

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
      const headerBottom =
        root.ownerDocument
          .querySelector(".site-nav")
          ?.getBoundingClientRect().bottom ?? 0;
      const visualViewportTop = window.visualViewport?.offsetTop ?? 0;
      const visibleTop =
        Math.max(0, headerBottom, visualViewportTop) + VISIBLE_TOP_GAP;
      const aboveTop = rootRect.top - CARD_GAP - card.offsetHeight;
      const automaticPlacement = aboveTop >= visibleTop ? "above" : "below";
      const placement =
        profileCardPlacement === "above" ? "above" : automaticPlacement;
      setCardLayouts((current) => ({
        ...current,
        [activeLabel]: { left, placement },
      }));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeLabel, profileCardPlacement]);

  useEffect(() => {
    const closeForOtherInstance = (event) => {
      if (event.target === rootRef.current) return;
      pointerFocusLabel.current = null;
      focusOwnedLabel.current = null;
      restoredFocusLabel.current = null;
      setActiveLabel(null);
    };
    document.addEventListener(INSTANCE_OPEN_EVENT, closeForOtherInstance);
    return () =>
      document.removeEventListener(INSTANCE_OPEN_EVENT, closeForOtherInstance);
  }, []);

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
          )
        ) {
          if (focusOwnedLabel.current) {
            openProfile(focusOwnedLabel.current);
          } else {
            setActiveLabel(null);
          }
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
                id={triggerId(social.label, idPrefix)}
                type="button"
                aria-expanded={expanded}
                aria-controls={cardId(social.label, idPrefix)}
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
                  openProfile(social.label);
                }}
                onPointerEnter={() => {
                  if (hoverCapable) openProfile(social.label);
                }}
                onClick={() => {
                  pointerFocusLabel.current = null;
                  if (!hoverCapable) {
                    if (activeLabel === social.label) {
                      setActiveLabel(null);
                    } else {
                      openProfile(social.label);
                    }
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
        const layout = cardLayouts[social.label];
        return (
          <section
            ref={(node) => setCardRef(social.label, node)}
            key={social.label}
            id={cardId(social.label, idPrefix)}
            className="social-profile-card"
            role="region"
            aria-labelledby={triggerId(social.label, idPrefix)}
            aria-hidden={!open}
            data-state={open ? "open" : "closed"}
            data-placement={layout?.placement ?? "above"}
            style={{
              "--social-card-left": `${layout?.left ?? 0}px`,
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
