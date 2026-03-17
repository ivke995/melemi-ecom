import connectDB from "@/config/db";
import Product from "@/models/Product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound, redirect } from "next/navigation";

const isMongoId = (value) => /^[a-f0-9]{24}$/i.test(value || "");

const normalizeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    _id: product._id?.toString?.() || product._id,
  };
};

export const revalidate = 3600;

export async function generateStaticParams() {
  await connectDB();
  const products = await Product.find({
    isActive: { $ne: false },
    slug: { $exists: true, $ne: "" },
  })
    .select("slug")
    .lean();

  return products.map((product) => ({ slug: product.slug }));
}

const ProductPage = async ({ params }) => {
  const { slug } = params;

  await connectDB();
  let product = await Product.findOne({ slug }).lean();

  if (!product && isMongoId(slug)) {
    const productById = await Product.findById(slug).lean();
    if (productById?.slug) {
      redirect(`/proizvod/${productById.slug}`);
    }
    product = productById;
  }

  if (!product) {
    notFound();
  }

  const featuredProducts = await Product.find({
    isActive: { $ne: false },
    _id: { $ne: product._id },
  })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  return (
    <>
      <Navbar />
      <ProductDetailsClient
        product={normalizeProduct(product)}
        featuredProducts={featuredProducts.map(normalizeProduct)}
      />
      <Footer />
    </>
  );
};

export default ProductPage;
