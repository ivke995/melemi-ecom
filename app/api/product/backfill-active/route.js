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

    await connectDB();
    const result = await Product.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    return NextResponse.json({
      success: true,
      message: "Proizvodi su ažurirani",
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
