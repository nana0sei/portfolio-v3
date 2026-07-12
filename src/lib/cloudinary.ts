// Replacement for `next-cloudinary`'s <CldImage>, which is Next-only.
// Builds a Cloudinary `CloudinaryImage` (from @cloudinary/url-gen) sized to fit
// within the given bounds while preserving aspect ratio (c_limit) so the
// masonry grid keeps each artwork's natural proportions, with automatic
// format/quality delivery. Render it with <AdvancedImage> from @cloudinary/react.
//
// The cloud name is a public value, so it is exposed to the client via a
// VITE_-prefixed env var (see .env / .env.example).

import type { CloudinaryImage } from "@cloudinary/url-gen";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
  string | undefined;

const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

export function cldImage(publicId: string): CloudinaryImage {
  return cld.image(publicId).resize(fill());
}
