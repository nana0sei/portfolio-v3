"use client";
import useCloudinaryImages from "@/app/hooks/useCloudinary";
import { lazy, Suspense } from "react";
import Masonry from "react-masonry-css";
const ArtCard = lazy(() => import("@/components/custom/ArtCard"));

const MasonryGrid = () => {
  const { data, isLoading } = useCloudinaryImages();

  if (isLoading) return <p>loading...</p>;

  return (
    <div>
      <Masonry
        breakpointCols={3}
        className="flex gap-2 pb-32"
        columnClassName="space-y-2"
      >
        {data?.resources.map((artwork, index) => (
          <div key={index} className="rounded-lg">
            <Suspense fallback={<div className="skeleton h-72 w-full" />}>
              <ArtCard art={artwork} key={artwork.public_id} />
            </Suspense>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
