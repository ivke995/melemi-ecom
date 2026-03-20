import connectDB from "@/config/db";
import Product from "@/models/Product";
import productCatalog from "@/data/products.json";
import liceTijeloObjavaImage from "@/assets/lice_tijelo_objava.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound, redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const currency = process.env.NEXT_PUBLIC_CURRENCY || "KM";
const isMongoId = (value) => /^[a-f0-9]{24}$/i.test(value || "");

const buildDescription = (value) => {
  const cleaned = (value || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
};

const catalogImageMap = {
  "lice_tijelo_objava.png": liceTijeloObjavaImage,
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || "");

const getProductImages = (product) => {
  if (!product) return [];
  if (Array.isArray(product.image)) {
    return product.image.filter(Boolean);
  }
  return product.image ? [product.image] : [];
};

const resolveCatalogImages = (product) => {
  const images = getProductImages(product);
  if (!images.length) return [];
  return images
    .map((image) => {
      if (typeof image === "string") {
        if (isAbsoluteUrl(image)) return image;
        const mapped = catalogImageMap[image];
        return mapped?.src ? new URL(mapped.src, baseUrl).toString() : null;
      }
      if (image?.src) {
        return new URL(image.src, baseUrl).toString();
      }
      return null;
    })
    .filter(Boolean);
};

const normalizeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    _id: product._id?.toString?.() || product._id,
  };
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = Array.isArray(productCatalog) ? productCatalog : [];
  return products
    .filter((product) => product?.slug && product?.isActive !== false)
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const products = Array.isArray(productCatalog) ? productCatalog : [];
  const product = products.find(
    (item) => item?.slug === slug || item?._id === slug
  );

  if (!product) {
    return {
      title: "Proizvod",
    };
  }

  const description = buildDescription(product.description);
  const images = resolveCatalogImages(product);
  const canonicalSlug = product.slug || slug;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/proizvod/${canonicalSlug}`,
    },
    openGraph: {
      title: product.name,
      description,
      url: `${baseUrl}/proizvod/${canonicalSlug}`,
      type: "website",
      images: images.length ? images : undefined,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: images.length ? images : undefined,
    },
  };
}

const ProductPage = async ({ params }) => {
  const { slug } = await params;

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

  const description = buildDescription(product.description);
  const images = getProductImages(product);
  const price = product.showDiscount ? product.offerPrice : product.price;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    sku: product._id?.toString?.() || product._id,
    brand: {
      "@type": "Brand",
      name: "Melemi Bojana",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/proizvod/${product.slug || slug}`,
      priceCurrency: currency,
      price,
      availability:
        product.isActive === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  if (images.length) {
    productSchema.image = images;
  }

  if (product.category) {
    productSchema.category = product.category;
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailsClient
        product={normalizeProduct(product)}
        featuredProducts={featuredProducts.map(normalizeProduct)}
      />
      <Footer />
    </>
  );
};

export default ProductPage;
