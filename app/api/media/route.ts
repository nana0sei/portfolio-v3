import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CloudinaryImages } from "@/lib/entities";

const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const api_key = process.env.NEXT_CLOUDINARY_API_KEY;
const api_secret = process.env.NEXT_CLOUDINARY_API_SECRET;

export async function GET() {
  try {
    const token = Buffer.from(`${api_key}:${api_secret}`).toString("base64");

    const res = await axios.get<CloudinaryImages>(
      `https://api.cloudinary.com/v1_1/${cloud_name}/resources/search`,
      {
        headers: { Authorization: "Basic " + token },
        params: {
          max_results: 100,
          expression: "folder:portfolio",
        },
      },
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
