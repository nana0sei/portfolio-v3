import { createFileRoute } from "@tanstack/react-router";
import artTitle from "@/assets/arttitle.png";
import MasonryGrid from "@/components/custom/MasonryGrid";

export const Route = createFileRoute("/art/")({ component: ArtPage });

function ArtPage() {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <img src={artTitle} alt="art" width={250} height={250} />
      </div>

      <MasonryGrid />
    </div>
  );
}
