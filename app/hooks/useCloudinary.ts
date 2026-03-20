import { CloudinaryImages } from "@/lib/entities";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCloudinaryImages = () =>
  useQuery({
    queryKey: ["cloudinary-images"],
    queryFn: () => {
      return axios.get<CloudinaryImages>("/api/media").then((res) => res.data);
    },
  });

export default useCloudinaryImages;
