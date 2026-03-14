import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.split("?")[0];
  const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  if (!match) return null;
  return match[1];
};

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Proizvod nije pronađen",
      });
    }

    await connectDB();
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Proizvod nije pronađen",
      });
    }

    const images = Array.isArray(product.image) ? product.image : [];
    const publicIds = images
      .map((imageUrl) => getCloudinaryPublicId(imageUrl))
      .filter(Boolean);

    await Product.findByIdAndDelete(productId);
    if (publicIds.length > 0) {
      await Promise.allSettled(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    }

    return NextResponse.json({
      success: true,
      message: "Proizvod je obrisan",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
