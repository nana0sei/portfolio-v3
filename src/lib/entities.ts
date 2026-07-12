// In Vite/TanStack Start, importing an image asset resolves to a URL string
// (unlike Next.js which returns a StaticImageData object). Project.image is
// therefore typed as `string`.

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

export interface Tracks {
  total: number;
  items: SimplifiedTrackObject[];
}

export interface Project {
  link: string;
  name: string;
  description: string;
  image: string;
  git?: string;
  tools: string[];
}

export interface Artwork {
  url: string;
  description: string;
}

export interface CloudinaryImage {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  placeholder: boolean;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  backup: boolean;
  folder: string;
  url: string;
  secure_url: string;
}

export interface CloudinaryImages {
  total_count: number;
  time: number;
  resources: CloudinaryImage[];
}
