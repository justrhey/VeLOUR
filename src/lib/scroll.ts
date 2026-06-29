/**
 * Lightweight shared scroll state, read inside the R3F render loop (useFrame)
 * and written by a single window scroll listener. A plain mutable singleton is
 * intentional here: it avoids a React re-render on every scroll frame.
 */
export const scrollState = {
  /** 0 → 1 over the whole page */
  progress: 0,
  /** index of the active varietal, driven by the reveal section / toggle */
  varietal: 0,
  /** pointer position in normalised device coords for parallax */
  pointerX: 0,
  pointerY: 0,
};
