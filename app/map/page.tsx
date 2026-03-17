import PageHeader from "@/components/PageHeader";
import SkiMap from "@/components/SkiResortMap";

export default function MapPage() {
  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="p-4 shrink-0">
        <PageHeader title="Resort Map" subtitle="Resorts in Colorado" />
      </div>

      <div className="flex-1 min-h-0">
        <SkiMap />
      </div>
    </div>
  );
}
