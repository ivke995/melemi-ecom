import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    const { productId, isActive } = await request.json();
    if (!productId || typeof isActive !== "boolean") {
      return NextResponse.json({
        success: false,
        message: "Neispravni podaci",
      });
    }

    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { isActive } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        message: "Proizvod nije pronađen",
      });
    }

    return NextResponse.json({
      success: true,
      message: isActive ? "Proizvod je aktivan" : "Proizvod je sakriven",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
