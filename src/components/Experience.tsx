"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { scrollState } from "@/lib/scroll";
import WineCard from "./WineCard";
import Grain from "./Grain";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/* ---- prefers-reduced-motion as an external store (no setState in effect) ---- */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getRM = () => window.matchMedia(RM_QUERY).matches;
const getRMServer = () => false;

/* ---- shared varietal selection ---- */
type Ctx = { index: number; setIndex: (i: number) => void };
const VarietalContext = createContext<Ctx>({ index: 0, setIndex: () => {} });
export const useVarietal = () => useContext(VarietalContext);

export default function Experience({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeRM, getRM, getRMServer);
  const [index, setIndexState] = useState(0);
  const [entered, setEntered] = useState(false);
  const raf = useRef(0);

  const setIndex = (i: number) => {
    scrollState.varietal = i;
    setIndexState(i);
  };
  const handleEnter = useCallback(() => setEntered(true), []);

  // Lenis smooth scroll — only after the intro card is dismissed, so the
  // card's scroll gesture never moves the page (it lands exactly at top).
  useEffect(() => {
    if (reduced || !entered) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 });
    let id = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduced, entered]);

  // window scroll → progress (rAF-throttled, no React re-render)
  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollState.progress = max > 0 ? window.scrollY / max : 0;
        raf.current = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // pointer parallax
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // scroll-reveal
  useEffect(() => {
    // flag the document so CSS hides reveals only now that JS is running
    document.documentElement.classList.add("reveal-ready");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduced) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    els.forEach((el) => {
      // reveal anything already on screen immediately; observe the rest
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        el.classList.add("in");
      } else {
        io.observe(el);
      }
    });
    // safety net: never leave content stuck hidden
    const t = window.setTimeout(
      () => els.forEach((el) => el.classList.add("in")),
      1500,
    );
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [reduced]);

  return (
    <VarietalContext.Provider value={{ index, setIndex }}>
      <WineCard onEnter={handleEnter} />
      {/* fixed 3D layer behind content (client-only via dynamic ssr:false) */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Scene reducedMotion={reduced} />
      </div>
      {children}
      <Grain />
    </VarietalContext.Provider>
  );
}
