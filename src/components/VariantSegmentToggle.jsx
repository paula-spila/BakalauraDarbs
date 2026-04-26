import { NavLink, useLocation } from "react-router-dom";
import { pathsForVariantToggle } from "../lib/variantPaths.js";

/**
 * Two in-app targets (same tab): minimal (A) vs rich (B).
 * Preserves path + query when switching.
 */
export function VariantSegmentToggle({ className = "" }) {
  const { pathname, search } = useLocation();
  const { pathA, pathB } = pathsForVariantToggle(pathname, search);

  return (
    <div
      className={`variant-segment ${className}`.trim()}
      role="group"
      aria-label="Pētījuma variants — pārslēgt starp A un B vienā pārlūkā"
    >
      <NavLink
        to={pathA}
        end
        className={({ isActive }) =>
          `variant-segment__btn${isActive ? " variant-segment__btn--active" : ""}`
        }
        title="Variants A — minimālais izkārtojums"
      >
        A
      </NavLink>
      <NavLink
        to={pathB}
        end
        className={({ isActive }) =>
          `variant-segment__btn${isActive ? " variant-segment__btn--active" : ""}`
        }
        title="Variants B — blīvāks, krāsaināks izkārtojums"
      >
        B
      </NavLink>
    </div>
  );
}
