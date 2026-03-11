import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-0.5 max-w-[200px] w-full animate-pulse rounded-xl">
      <div className="relative bg-gray-200/80 rounded-lg w-full h-52"></div>
      <div className="h-4 bg-gray-200/80 rounded w-3/4 mt-2"></div>
      <div className="h-3 bg-gray-200/70 rounded w-full mt-1 max-sm:hidden"></div>
      <div className="flex items-end justify-between w-full mt-2">
        <div className="h-4 bg-gray-200/80 rounded w-20"></div>
        <div className="h-7 bg-gray-200/70 rounded-full w-20 max-sm:hidden"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
