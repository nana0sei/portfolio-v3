import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { Tracks } from "@/lib/entities";

export async function GET() {
  const cookie_store = await cookies();
  let access_token = cookie_store.get("access_token")?.value;

  if (!access_token) {
    const refresh_response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/spotify-auth`,
    );

    if (refresh_response.status !== 200) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 },
      );
    }

    access_token = refresh_response.data.access_token;
  }

  try {
    const res = await axios.get<Tracks>(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          limit: 1,
          before: new Date().getTime(),
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch recently played" },
      { status: 500 },
    );
  }
}
