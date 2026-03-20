import Link from "next/link";
import useRecentlyPlayed from "../hooks/useRecentlyPlayed";
import Image from "next/image";

const RecentlyPlayedCard = () => {
  const { data: tracks, isLoading, error } = useRecentlyPlayed();

  if (isLoading) return <div className="skeleton w-60 h-16" />;

  if (error) return null;

  const latest_song = tracks?.items[0]!;

  return (
    <>
      <div className="card bg-base-200 shadow-md p-2 w-60 h-16">
        <div className="flex gap-2 items-center">
          <Image
            src={latest_song.track.album.images[0].url}
            alt="nana icon"
            width={48}
            height={48}
            className="rounded-lg overflow-clip"
          />
          <div>
            <Link
              href={latest_song.track.external_urls.spotify!}
              target="_blank"
            >
              <p className="font-semibold text-blue-400 hover:underline">
                {latest_song.track.name.length > 20
                  ? `${latest_song.track.name.slice(0, 15)}...`
                  : latest_song.track.name}
              </p>
            </Link>

            {latest_song.track.artists.map((a) => a.name).join(", ").length >
            25 ? (
              <div className="marquee-wrapper">
                <p className="text-sm marquee">
                  {latest_song.track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            ) : (
              <p className="text-sm">
                {latest_song.track.artists.map((a) => a.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentlyPlayedCard;
