"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";

const EditProduct = () => {
  const { getToken, products, router } = useAppContext();
  const { id } = useParams();

  const [productData, setProductData] = useState(null);
  const [imageSlots, setImageSlots] = useState(Array(4).fill(null));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [showDiscount, setShowDiscount] = useState(true);
  const [measureType, setMeasureType] = useState("none");
  const [weightGrams, setWeightGrams] = useState("");
  const [volumeMl, setVolumeMl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || products.length === 0) return;
    const product = products.find((item) => item._id === id);
    if (!product) {
      setLoading(false);
      toast.error("Proizvod nije pronađen");
      return;
    }

    setProductData(product);
    setName(product.name || "");
    setDescription(product.description || "");
    setCategory(product.category || "Earphone");
    setPrice(product.price ?? "");
    setOfferPrice(product.offerPrice ?? "");
    setShowDiscount(product.showDiscount !== false);
    const hasWeight =
      product.weightGrams !== null && product.weightGrams !== undefined;
    const hasVolume =
      product.volumeMl !== null && product.volumeMl !== undefined;
    const resolvedMeasureType = hasWeight
      ? "weight"
      : hasVolume
        ? "volume"
        : "none";
    setMeasureType(resolvedMeasureType);
    setWeightGrams(hasWeight ? String(product.weightGrams) : "");
    setVolumeMl(hasVolume ? String(product.volumeMl) : "");
    const slots = Array.from({ length: 4 }, (_, index) => {
      return product.image?.[index] || null;
    });
    setImageSlots(slots);
    setLoading(false);
  }, [id, products.length, products]);

  const handleImageChange = (index, file) => {
    const updatedSlots = [...imageSlots];
    updatedSlots[index] = file;
    setImageSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData) return;

    const formData = new FormData();
    formData.append("productId", productData._id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    const resolvedOfferPrice = showDiscount ? offerPrice : price;
    formData.append("price", price);
    formData.append("offerPrice", resolvedOfferPrice);
    formData.append("showDiscount", showDiscount);
    const payloadWeightGrams = measureType === "weight" ? weightGrams : "";
    const payloadVolumeMl = measureType === "volume" ? volumeMl : "";
    formData.append("weightGrams", payloadWeightGrams);
    formData.append("volumeMl", payloadVolumeMl);

    const existingImages = imageSlots.map((slot, index) => {
      if (typeof slot === "string") return slot;
      return productData.image?.[index] || "";
    });
    formData.append("existingImages", JSON.stringify(existingImages));

    imageSlots.forEach((slot, index) => {
      if (slot instanceof File) {
        formData.append("images", slot);
        formData.append("imageIndexes", index);
      }
    });

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/product/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        router.push("/prodavac/lista-proizvoda");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Slika proizvoda</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => {
              const slot = imageSlots[index];
              const preview = slot
                ? slot instanceof File
                  ? URL.createObjectURL(slot)
                  : slot
                : assets.upload_area;

              return (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <Image
                    className="max-w-24 cursor-pointer"
                    src={preview}
                    alt=""
                    width={100}
                    height={100}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Naziv proizvoda
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Unesite ovdje"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Opis proizvoda
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Unesite ovdje"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium" htmlFor="product-measure">
              Mjera
            </label>
            <select
              id="product-measure"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => {
                const value = e.target.value;
                setMeasureType(value);
                if (value !== "weight") setWeightGrams("");
                if (value !== "volume") setVolumeMl("");
              }}
              value={measureType}
            >
              <option value="none">Nije navedeno</option>
              <option value="weight">Gramaza (g)</option>
              <option value="volume">Zapremina (ml)</option>
            </select>
          </div>
          {measureType === "weight" && (
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="product-weight">
                Gramaza (g)
              </label>
              <input
                id="product-weight"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setWeightGrams(e.target.value)}
                value={weightGrams}
                min="0"
                required
              />
            </div>
          )}
          {measureType === "volume" && (
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="product-volume">
                Zapremina (ml)
              </label>
              <input
                id="product-volume"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setVolumeMl(e.target.value)}
                value={volumeMl}
                min="0"
                required
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Kategorija
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Earphone">Slušalice (in-ear)</option>
              <option value="Headphone">Slušalice (over-ear)</option>
              <option value="Watch">Sat</option>
              <option value="Smartphone">Pametni telefon</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Kamera</option>
              <option value="Accessories">Dodaci</option>
              <option value="Melem">Melem</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Cijena proizvoda
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          {showDiscount && (
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="offer-price">
                Snižena cijena
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="show-discount"
            type="checkbox"
            className="h-4 w-4"
            checked={showDiscount}
            onChange={(e) => setShowDiscount(e.target.checked)}
          />
          <label className="text-sm text-gray-700" htmlFor="show-discount">
            Prikaži popust
          </label>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          SAČUVAJ
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default EditProduct;
