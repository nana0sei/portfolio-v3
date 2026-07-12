import useCloudinaryImages from "@/hooks/useCloudinary";
import Masonry from "react-masonry-css";
import { Skeleton } from "@/components/ui/skeleton";
import ArtCard from "@/components/custom/ArtCard";

const MasonryGrid = () => {
  const { data, isLoading, error } = useCloudinaryImages();

  if (isLoading)
    return (
      <Masonry
        breakpointCols={3}
        className="flex gap-2"
        columnClassName="space-y-2"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="skeleton h-72 w-full" />
        ))}
      </Masonry>
    );

  if (error) return null;
  return (
    <div>
      <Masonry
        breakpointCols={3}
        className="flex gap-2 pb-32"
        columnClassName="space-y-2"
      >
        {data?.resources.map((artwork, index) => (
          <div key={index} className="rounded-lg">
            <ArtCard art={artwork} key={artwork.public_id} />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
