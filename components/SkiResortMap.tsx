// components/map/SkiMap.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import useResorts from "@/hooks/useResorts";
import { Resort } from "@/types/Resort";
import PassBadge from "@/components/PassBadge";
import { MdAcUnit } from "react-icons/md";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const SOURCE_ID = "resorts";

function resortsToGeoJSON(resorts: Resort[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: resorts.map((r) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [r.lng, r.lat] },
      properties: {
        id: r.id,
        name: r.name,
        snowfall3d: r.snowfall3d,
        baseDepth: r.baseDepth,
        openLifts: r.openLifts,
        totalLifts: r.totalLifts,
        openTrails: r.openTrails,
        totalTrails: r.totalTrails,
        pass: r.pass ?? "",
        passAccess: r.passAccess ?? "",
        snowColor: getSnowColor(r.snowfall3d),
      },
    })),
  };
}

function getSnowColor(snowfall3d: string): string {
  const inches = parseFloat(snowfall3d);
  if (inches >= 6) return "#1a6fc4";
  if (inches >= 3) return "#4a9eff";
  if (inches >= 1) return "#7eb8f7";
  return "#8b949e";
}

type SelectedResort = {
  name: string;
  snowfall3d: string;
  baseDepth: string;
  openLifts: string;
  totalLifts: string;
  openTrails: string;
  totalTrails: string;
  pass: string;
  id: string;
};

export default function SkiMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { data: resorts, isLoading } = useResorts();
  const [selected, setSelected] = useState<SelectedResort | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-106.0, 39.5],
      zoom: 7,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update active pin color when selected changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    if (!map.current.getLayer("unclustered-point")) return;
    map.current.setPaintProperty("unclustered-point", "circle-color", [
      "case",
      ["==", ["get", "id"], selected?.id ?? ""],
      "#EF7C56",
      ["get", "snowColor"],
    ]);
  }, [selected]);

  // Add/update GeoJSON source and layers when resorts load
  useEffect(() => {
    if (!map.current || !resorts) return;

    const geojson = resortsToGeoJSON(resorts);

    const addLayers = () => {
      const m = map.current!;

      // Remove old layers/source if they exist (e.g. hot reload)
      ["clusters", "cluster-count", "unclustered-point", "unclustered-label"].forEach((id) => {
        if (m.getLayer(id)) m.removeLayer(id);
      });
      if (m.getSource(SOURCE_ID)) m.removeSource(SOURCE_ID);

      m.addSource(SOURCE_ID, {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 50,
      });

      // Cluster circles
      m.addLayer({
        id: "clusters",
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#4a9eff",
          "circle-radius": ["step", ["get", "point_count"], 20, 5, 28, 10, 34],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.9,
        },
      });

      // Cluster count labels
      m.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 13,
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        },
        paint: { "text-color": "#fff" },
      });

      // Individual resort circles
      m.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "snowColor"],
          "circle-radius": 16,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-stroke-opacity": 1,
        },
      });


      // Individual resort snowfall labels
      m.addLayer({
        id: "unclustered-label",
        type: "symbol",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": ['concat', ["get", "snowfall3d"], '"'],
          "text-size": 11,
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
        },
        paint: { "text-color": "#fff" },
      });

      // Click cluster → zoom in
      m.on("click", "clusters", (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties?.cluster_id;
        (m.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            m.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom ?? 10,
            });
          }
        );
      });

      // Click individual resort → bottom card
      m.on("click", "unclustered-point", (e) => {
        const props = e.features?.[0]?.properties;
        if (!props) return;
        setSelected(props as SelectedResort);
      });

      // Click map background → dismiss card
      m.on("click", (e) => {
        const features = m.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point", "clusters"],
        });
        if (features.length === 0) setSelected(null);
      });

      // Cursor changes
      m.on("mouseenter", "clusters", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "clusters", () => { m.getCanvas().style.cursor = ""; });
      m.on("mouseenter", "unclustered-point", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "unclustered-point", () => { m.getCanvas().style.cursor = ""; });
    };

    if (map.current.isStyleLoaded()) {
      addLayers();
    } else {
      map.current.once("load", addLayers);
    }
  }, [resorts]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-xl overflow-hidden w-52">
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
            <div className="p-5 flex flex-col items-center gap-3">
              <MdAcUnit className="text-sky-400 animate-spin" size={36} style={{ animationDuration: "3s" }} />
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Loading resorts</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Fetching snow conditions…</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Bottom info card */}
      {selected && (
        <div className="absolute bottom-[calc(5rem+env(safe-area-inset-bottom)+0.5rem)] left-4 right-4 z-10">
          <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-lg overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white">{selected.name}</h3>
                    {selected.pass && <PassBadge pass={selected.pass as "Epic" | "Ikon"} />}
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 capitalize">{selected.pass ? `${selected.pass} Pass` : "No pass"}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 text-xl leading-none ml-2"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 divide-x divide-zinc-100 dark:divide-zinc-700">
                <div className="text-center pr-2">
                  <p className="text-xl font-bold text-orange-400">{selected.snowfall3d}"</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">3-day snow</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {selected.openLifts}
                    <span className="text-sm font-normal text-zinc-300 dark:text-zinc-600">/{selected.totalLifts}</span>
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">lifts open</p>
                </div>
                <div className="text-center pl-2">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {selected.openTrails}
                    <span className="text-sm font-normal text-zinc-300 dark:text-zinc-600">/{selected.totalTrails}</span>
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">trails open</p>
                </div>
              </div>

              <Link
                href={`/resorts/${selected.id}`}
                className="mt-3 flex items-center justify-center rounded-xl bg-sky-500 py-2 text-xs font-medium text-white"
              >
                View resort →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
