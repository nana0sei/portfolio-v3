import Link from "next/link";
import Image from "next/image";
import useRecentlyPlayed from "@/app/hooks/useRecentlyPlayed";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const RecentlyPlayedCard = () => {
  const { data: tracks, isLoading, error } = useRecentlyPlayed();

  if (isLoading) return <Skeleton className="w-60 h-12" />;

  if (error) return null;

  const latest_song = tracks?.items[0]!;
  const latest_song_title = latest_song.track.name;
  const latest_song_artists = latest_song.track.artists
    .map((a) => a.name)
    .join(", ");
  const latest_song_label = `${latest_song_title} ${latest_song_artists}`;

  return (
    <Popover>
      <PopoverTrigger className="rounded-lg bg-slate-50 dark:bg-zinc-800 shadow-md p-2 w-60 h-12 hover:scale-95 transition-transform overflow-hidden cursor-pointer">
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
      </PopoverTrigger>
      <PopoverContent side="top" className="w-60 p-2 flex flex-col gap-1">
        <div className="my-1 font-semibold">recently played</div>
        {tracks?.items.map((item) => (
          <Link
            key={item.track.id}
            href={item.track.external_urls.spotify}
            target="_blank"
            className="flex gap-2 items-center rounded-md p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors overflow-hidden"
          >
            <Image
              src={item.track.album.images[0].url}
              alt={item.track.name}
              width={32}
              height={32}
              className="rounded-sm overflow-clip shrink-0"
            />
            <div className="text-sm min-w-0">
              <div className="text-blue-400 font-semibold truncate">
                {item.track.name}
              </div>
              <div className="text-sm truncate">
                {item.track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default RecentlyPlayedCard;
