import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinry
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    const formData = await request.formData();
    const productId = formData.get("productId");
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const weightGramsRaw = formData.get("weightGrams");
    const volumeMlRaw = formData.get("volumeMl");
    const showDiscountValue = formData.get("showDiscount");
    const showDiscount =
      showDiscountValue === null ? true : showDiscountValue === "true";
    const resolvedOfferPrice = showDiscount ? offerPrice : price;
    const weightGrams =
      weightGramsRaw === null || weightGramsRaw === ""
        ? null
        : Number(weightGramsRaw);
    const volumeMl =
      volumeMlRaw === null || volumeMlRaw === ""
        ? null
        : Number(volumeMlRaw);

    const existingImagesRaw = formData.get("existingImages");
    const existingImages = existingImagesRaw
      ? JSON.parse(existingImagesRaw)
      : [];
    const files = formData.getAll("images");
    const imageIndexes = formData.getAll("imageIndexes");

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Proizvod nije pronađen",
      });
    }

    let updatedImages =
      Array.isArray(existingImages) && existingImages.length > 0
        ? existingImages
        : product.image || [];

    if (files && files.length > 0) {
      const results = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "auto" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.end(buffer);
          });
        })
      );

      results.forEach((result, index) => {
        const slotIndex = Number(imageIndexes[index]);
        if (!Number.isNaN(slotIndex) && result?.secure_url) {
          updatedImages[slotIndex] = result.secure_url;
        }
      });
    }

    updatedImages = updatedImages.filter(Boolean);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(resolvedOfferPrice),
        showDiscount,
        image: updatedImages,
        weightGrams,
        volumeMl,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Proizvod je ažuriran",
      updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
