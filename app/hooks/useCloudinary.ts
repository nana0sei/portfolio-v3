import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

const useCloudinary = (imageUrl: string) => {
  const image = cld.image(imageUrl);
  image.resize(fill());

  return { image };
};

export default useCloudinary;
