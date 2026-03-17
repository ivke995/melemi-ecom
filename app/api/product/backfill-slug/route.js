import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import { slugify } from "@/lib/blog";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const resolveSlug = (name, fallbackSeed, existingSlugs) => {
  const baseSlug = slugify(name || "");
  const fallbackSlug = baseSlug || `proizvod-${fallbackSeed}`;
  let resolvedSlug = fallbackSlug;
  let suffix = 1;

  while (existingSlugs.has(resolvedSlug)) {
    resolvedSlug = `${fallbackSlug}-${suffix}`;
    suffix += 1;
  }

  existingSlugs.add(resolvedSlug);
  return resolvedSlug;
};

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    await connectDB();

    const existingSlugsRaw = await Product.find({
      slug: { $exists: true, $ne: "" },
    })
      .select("slug")
      .lean();
    const existingSlugs = new Set(
      existingSlugsRaw.map((product) => product.slug)
    );

    const products = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }],
    })
      .select("_id name")
      .lean();

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Svi proizvodi već imaju slug",
        matched: 0,
        modified: 0,
      });
    }

    const updates = products.map((product) => {
      const fallbackSeed = product?._id?.toString?.() || Date.now();
      const resolvedSlug = resolveSlug(
        product?.name,
        fallbackSeed,
        existingSlugs
      );
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { slug: resolvedSlug } },
        },
      };
    });

    const result = updates.length
      ? await Product.bulkWrite(updates)
      : { matchedCount: 0, modifiedCount: 0 };

    return NextResponse.json({
      success: true,
      message: "Slugovi su ažurirani",
      matched: result.matchedCount ?? result.nMatched ?? 0,
      modified: result.modifiedCount ?? result.nModified ?? 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
