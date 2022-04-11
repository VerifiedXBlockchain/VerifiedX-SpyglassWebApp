import mapboxgl, { Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { BlockList } from "./block-list";

interface Props {
  validatorAddress?: string;
}

export const BlockMapContainer = (props: Props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const mapContainer = useRef<mapboxgl.Map | undefined>(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37);
  const [zoom, setZoom] = useState(2);

  const [loading, setLoading] = useState(true);

  const fetchPage = async () => {
    const service = new BlockService();
    try {
      const data = await service.list(1, { limit: 100 });

      setLoading(false);

      for (const block of data.results) {
        if (block.masternode?.location) {
          const marker = new mapboxgl.Marker()
            .setLngLat([
              block.masternode.location.longitude,
              block.masternode.location.latitude,
            ])
            // .setPopup(new Popup().setText(`Block ${block.height}`))
            .setPopup(
              new Popup().setHTML(
                `<div>
                <h6>Block ${block.height}</h6>
                <div class="pb-1">Hash: ${block.hashPreview()}</div>
                <div class="pb-1">Validator: ${
                  block.masternode.uniqueNameLabel
                }</div>
                <a class="btn btn-primary" href="/block/${
                  block.height
                }" target="_blank">Details</a>
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
    const poll = () => {
      fetchPage();
    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [blocks]);

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
