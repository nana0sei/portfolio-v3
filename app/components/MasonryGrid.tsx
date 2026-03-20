"use client";
import { lazy, Suspense } from "react";
import photos from "@/lib/data/photos";
const ArtCard = lazy(() => import("../components/ArtCard"));
import Masonry from "react-masonry-css";

const MasonryGrid = () => {
  return (
    <div>
      <Masonry
        breakpointCols={3}
        className="flex gap-2 pb-32"
        columnClassName="space-y-2"
      >
        {photos.map((artwork, index) => (
          <div key={index} className="rounded-lg">
            <Suspense fallback={<div className="skeleton h-72 w-full" />}>
              <ArtCard art={artwork} key={artwork.description} />
            </Suspense>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
