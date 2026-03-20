interface ImageObject {
  url: string;
  height: number;
  width: number;
}

interface SimplifiedArtistObject {
  id: string;
  name: string;
  images: ImageObject[];
  type: string;
}

interface Album {
  id: string;
  name: string;
  album_type: string;
  total_tracks: number;
  release_date: string;
  images: ImageObject[];
  artists: SimplifiedArtistObject[];
  tracks: Tracks;
}

interface SimplifiedTrackObject {
  track: {
    id: string;
    artists: SimplifiedArtistObject[];
    name: string;
    track_number: number;
    explicit: boolean;
    duration_ms: number;
    album: Album;
    external_urls: {
      spotify: string;
    };
  };
}

interface Tracks {
  total: number;
  items: SimplifiedTrackObject[];
}

export default Tracks;
