import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CloudinaryImages } from "@/lib/entities";

const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const api_key = process.env.NEXT_CLOUDINARY_API_KEY;
const api_secret = process.env.NEXT_CLOUDINARY_API_SECRET;

export async function GET() {
  const token = Buffer.from(`${api_key}:${api_secret}`).toString("base64");

  const res = await axios.get<CloudinaryImages>(
    `https://api.cloudinary.com/v1_1/${cloud_name}/resources/image?max_results=100&prefix=portfolio&type=upload`,
    {
      headers: {
        Authorization: "Basic " + token,
      },
    },
  );

  if (!res)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(res, { status: 200 });
}
