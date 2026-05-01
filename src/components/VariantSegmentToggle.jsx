import { NavLink, useLocation } from "react-router-dom";
import { pathsForVariantToggle } from "../lib/variantPaths.js";

/**
 * Version A (minimal) ↔ Version B (rich), same tab. Preserves path + query.
 * @param {"floating" | "inline" | "header"} placement — header = mazs A/B labajā augšējā stūrī
 */
export function VariantSegmentToggle({ placement = "floating" }) {
  const { pathname, search } = useLocation();
  const { pathA, pathB } = pathsForVariantToggle(pathname, search);
  const isFloating = placement === "floating";
  const isHeader = placement === "header";

  if (isHeader) {
    return (
      <div
        className="variant-segment variant-segment--header"
        role="group"
        aria-label="Pārslēgt starp variantu A (minimālais) un B (blīvs)"
      >
        <NavLink
          to={pathA}
          end
          className={({ isActive }) =>
            `variant-segment__btn variant-segment__btn--compact${isActive ? " variant-segment__btn--active" : ""}`
          }
        >
          A
        </NavLink>
        <NavLink
          to={pathB}
          end
          className={({ isActive }) =>
            `variant-segment__btn variant-segment__btn--compact${isActive ? " variant-segment__btn--active" : ""}`
          }
        >
          B
        </NavLink>
      </div>
    );
  }

  return (
    <div
      className={
        isFloating
          ? "variant-segment variant-segment--floating"
          : "variant-segment variant-segment--inline"
      }
      role="group"
      aria-label="Pārslēgt starp Version A (minimālais) un Version B (blīvs)"
    >
      <NavLink
        to={pathA}
        end
        className={({ isActive }) =>
          `variant-segment__btn${isActive ? " variant-segment__btn--active" : ""}`
        }
      >
        {isFloating ? (
          <>
            <span className="variant-segment__ver">Version A</span>
            <span className="variant-segment__sub">minimālais</span>
          </>
        ) : (
          "Version A"
        )}
      </NavLink>
      <NavLink
        to={pathB}
        end
        className={({ isActive }) =>
          `variant-segment__btn${isActive ? " variant-segment__btn--active" : ""}`
        }
      >
        {isFloating ? (
          <>
            <span className="variant-segment__ver">Version B</span>
            <span className="variant-segment__sub">blīvs</span>
          </>
        ) : (
          "Version B"
        )}
      </NavLink>
    </div>
  );
}
