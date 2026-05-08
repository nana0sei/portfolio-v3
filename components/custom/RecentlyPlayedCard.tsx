import Link from "next/link";
import Image from "next/image";
import useRecentlyPlayed from "@/app/hooks/useRecentlyPlayed";
import { Skeleton } from "../ui/skeleton";

const RecentlyPlayedCard = () => {
  const { data: tracks, isLoading, error } = useRecentlyPlayed();

  if (isLoading) return <Skeleton className="w-60 h-16" />;

  if (error) return null;

  const latest_song = tracks?.items[0]!;

  return (
    <>
      <Link
        href={latest_song.track.external_urls.spotify!}
        target="_blank"
        className="rounded-lg bg-slate-50 dark:bg-zinc-800 shadow-md p-2 w-60 hover:scale-95 transition-transform"
      >
        <div className="flex gap-2 items-center">
          <Image
            src={latest_song.track.album.images[0].url}
            alt="nana icon"
            width={30}
            height={30}
            className="rounded-md overflow-clip"
          />
          <div>
            {latest_song.track.artists.map((a) => a.name).join(", ").length >
            25 ? (
              <div className="marquee-wrapper">
                <div className="text-sm marquee">
                  <span className="text-blue-400">
                    {latest_song.track.name}
                  </span>{" "}
                  {latest_song.track.name} &mdash;{" "}
                  {latest_song.track.artists.map((a) => a.name).join(", ")}
                </div>
              </div>
            ) : (
              <p className="text-sm">
                <span className="text-blue-400">{latest_song.track.name}</span>{" "}
                &mdash;{" "}
                {latest_song.track.artists.map((a) => a.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default RecentlyPlayedCard;
