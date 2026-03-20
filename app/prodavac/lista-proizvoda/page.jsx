"use client";
import React, { useCallback, useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const categoryLabels = {
  Melem: "Melem",
  Krema: "Krema",
  Sirup: "Sirup",
  Ulje: "Ulje",
  Piling: "Piling",
  Set: "Set"
};

const ProductList = () => {
  const { router, getToken, user, currency, getProductPrice, fetchProductData } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user, fetchSellerProduct]);

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm("Da li ste sigurni da želite obrisati proizvod?");
    if (!confirmed) return;
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/product/delete",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProducts((prev) => prev.filter((product) => product._id !== productId));
        toast.success(data.message);
        fetchProductData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleProductActive = async (productId, nextActive) => {
    const confirmMessage = nextActive
      ? "Da li želite vratiti proizvod u prodaju?"
      : "Da li ste sigurni da želite sakriti proizvod?";
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/product/active",
        { productId, isActive: nextActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? { ...product, isActive: nextActive }
              : product
          )
        );
        toast.success(data.message);
        fetchProductData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">Svi proizvodi</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="table-auto w-max min-w-full">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Proizvod
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Kategorija
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Cijena</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Akcija
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => {
                  const isActive = product.isActive !== false;
                  return (
                    <tr key={index} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {categoryLabels[product.category] || product.category}
                    </td>
                    <td className="px-4 py-3">
                      {getProductPrice(product)} {currency}
                      {product.showDiscount !== false && (
                        <span className="text-xs text-gray-400 line-through ml-2">
                          {product.price} {currency}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium ${
                            isActive ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {isActive ? "Aktivan" : "Skriven"}
                        </span>
                        <button
                          onClick={() =>
                            router.push(`/proizvod/${product.slug || product._id}`)
                          }
                          className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                        >
                          <span className="hidden md:block">Posjeti</span>
                          <Image
                            className="h-3.5 mr-3"
                            src={assets.redirect_icon}
                            alt="redirect_icon"
                          />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/prodavac/uredi-proizvod/${product._id}`)
                          }
                          className="px-2.5 md:px-3.5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                        >
                          Uredi
                        </button>
                        <button
                          onClick={() =>
                            toggleProductActive(product._id, !isActive)
                          }
                          className="px-2.5 md:px-3.5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                        >
                          {isActive ? "Sakrij" : "Prikaži"}
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-2.5 md:px-3.5 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
