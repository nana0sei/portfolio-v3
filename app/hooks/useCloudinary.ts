import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { GET } from "../api/media/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CloudinaryImages } from "@/lib/entities";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
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

export const useCloudinaryImages = () =>
  useQuery({
    queryKey: ["cloudinary-images"],
    queryFn: () => {
      return axios.get<CloudinaryImages>("/api/media").then((res) => res.data);
    },
  });
