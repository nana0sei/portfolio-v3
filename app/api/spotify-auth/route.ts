import axios from "axios";
import { add } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function POST() {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const res = await axios.post<Token>(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token!,
      }),
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const expiry_date = add(new Date(), { seconds: res.data.expires_in });

    const cookieStore = await cookies();
    cookieStore.set("access_token", res.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiry_date,
      path: "/",
    });

    return NextResponse.json({ access_token: res.data.access_token });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
  }
}
