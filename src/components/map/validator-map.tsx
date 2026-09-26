import mapboxgl, { Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { ValidatorService } from "../../services/validator-service";
import { useLocalized } from "../../utils/use-localized";
import { Spinner } from "../ui/spinner";
import styles from "./validator-map.module.scss";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] as string));

/** World map of active validators; each marker opens a popup linking to the validator page. */
export const ValidatorMap = () => {
  const { t } = useTranslation("common");
  const localized = useLocalized();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (map.current || !container.current) return;
    map.current = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-96, 37],
      zoom: 2,
    });

    let cancelled = false;
    new ValidatorService()
      .map(1, { is_active: true })
      .then((data) => {
        if (cancelled || !map.current) return;
        for (const validator of data.results) {
          if (validator.latitude && validator.longitude) {
            new mapboxgl.Marker()
              .setLngLat([validator.longitude, validator.latitude])
              .setPopup(
                new Popup().setHTML(
                  `<div class="${styles.popup}"><div class="${styles.popupAddress}">${escapeHtml(validator.address)}</div><a class="${styles.popupLink}" href="${localized(
                    `/validators/${encodeURIComponent(validator.address)}`
                  )}">${escapeHtml(t("action.viewDetails") as string)}</a></div>`
                )
              )
              .addTo(map.current);
          }
        }
      })
      .catch((error) => console.error("Validator map fetch failed", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Map is created once; localized/t are stable enough for the popup markup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.outer}>
      <div ref={container} className={styles.map} />
      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      ) : null}
    </div>
  );
};
