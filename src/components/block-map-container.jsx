import mapboxgl, { Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";


export const BlockMapContainer = () => {
  // const [blocks, setBlocks] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37);
  const [zoom, setZoom] = useState(2);

  const [loading, setLoading] = useState(true);

  const fetchPage = async () => {
    const service = new ValidatorService();
    try {
      const data = await service.map(1, { is_active: true });

      setLoading(false);

      for (const validator of data.results) {
        if (validator.latitude && validator.longitude) {
          const marker = new mapboxgl.Marker()
            .setLngLat([
              validator.longitude,
              validator.latitude,
            ])
            // .setPopup(new Popup().setText(`Block ${block.height}`))
            .setPopup(
              new Popup().setHTML(
                `<div>
                <h6 class="mb-0">${validator.address}</h6>
                <div class="text-center pt-2">
                <a class="btn btn-primary btn-sm d-block" href="/validators/${validator.address
                }" target="_blank">Details</a>
                </div>
                </div>
                `
              )
            )

            .addTo(map.current);
        }
      }
      //   setBlocks(data.results);

      console.log("Added");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    fetchPage();

  }, []);

  return (
    <div className="map-outer-container">
      <div ref={mapContainer} className="map-container"></div>
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}
    </div>
  );
};
