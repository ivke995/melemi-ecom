'use client'
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const Prodavnica = () => {

    const { products, productsLoading } = useAppContext();
    const showSkeletons = productsLoading && products.length === 0;
    const placeholders = Array.from({ length: 10 });

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">Prodavnica</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {showSkeletons
                        ? placeholders.map((_, index) => <ProductCardSkeleton key={index} />)
                        : products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Prodavnica;
