import Link from "next/link";
import Image from "next/image";
import useRecentlyPlayed from "@/app/hooks/useRecentlyPlayed";
import { Skeleton } from "../ui/skeleton";

const RecentlyPlayedCard = () => {
  const { data: tracks, isLoading, error } = useRecentlyPlayed();

  if (isLoading) return <Skeleton className="w-60 h-12" />;

  if (error) return null;

  const latest_song = tracks?.items[0]!;
  const latest_song_title = tracks?.items[0]!.track.name;
  const latest_song_artists = tracks?.items[0]!.track.artists.map(
    (a) => a.name,
  ).join(", ");
  const latest_song_label = `${latest_song_title} ${latest_song_artists}`;

  return (
    <>
      <Link
        href={latest_song.track.external_urls.spotify!}
        target="_blank"
        className="rounded-lg bg-slate-50 dark:bg-zinc-800 shadow-md p-2 w-60 h-12 hover:scale-95 transition-transform overflow-hidden"
      >
        <div className="flex gap-2 items-center">
          <Image
            src={latest_song.track.album.images[0].url}
            alt="nana icon"
            width={30}
            height={30}
            className="rounded-sm overflow-clip"
          />
          <div>
            {latest_song_label.length > 20 ? (
              <div className="marquee-wrapper w-full">
                <p className="text-sm marquee">
                  <span className="text-blue-400 font-semibold">
                    {latest_song.track.name}
                  </span>{" "}
                  &mdash;{" "}
                  {latest_song.track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            ) : (
              <p className="text-sm">
                <span className="text-blue-400 font-semibold">
                  {latest_song.track.name}
                </span>{" "}
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
