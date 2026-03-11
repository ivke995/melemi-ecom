import React from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, productsLoading, router } = useAppContext()
  const showSkeletons = productsLoading && products.length === 0;
  const placeholders = Array.from({ length: 10 });

    return (
      <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popularni proizvodi</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {showSkeletons
          ? placeholders.map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>
      <button onClick={() => { router.push('/prodavnica') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        Vidi više
      </button>
    </div>
  );
};

export default HomeProducts;
