import type { Tracks } from "@/lib/entities";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useRecentlyPlayed = () =>
  useQuery({
    queryKey: ["recently-played"],
    queryFn: () =>
      axios.get<Tracks>("/api/recently-played").then((res) => res.data),
  });

export default useRecentlyPlayed;
