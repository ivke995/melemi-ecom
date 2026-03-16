"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Melem");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [showDiscount, setShowDiscount] = useState(true);
  const [measureType, setMeasureType] = useState("none");
  const [weightGrams, setWeightGrams] = useState("");
  const [volumeMl, setVolumeMl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
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

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Melem");
        setPrice("");
        setOfferPrice("");
        setShowDiscount(true);
        setMeasureType("none");
        setWeightGrams("");
        setVolumeMl("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Slika proizvoda</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
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
              defaultValue={category}
            >
              <option value="Melem">Melem</option>
              <option value="Krema">Krema</option>
              <option value="Sirup">Sirup</option>
              <option value="Ulje">Ulje</option>
              <option value="Piling">Piling</option>
              <option value="Set">Set</option>
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
          DODAJ
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
