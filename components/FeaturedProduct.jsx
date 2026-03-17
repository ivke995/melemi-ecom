import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    image: assets.girl_with_sirup_image,
    title: "Biljni sirupi za imunitet",
    description: "Prirodne mješavine bilja koje nježno podržavaju vitalnost.",
  },
  {
    id: 2,
    image: assets.girl_with_something_nice,
    title: "Melemi za mekšu kožu",
    description: "Ručne formule za umirenje i zaštitu kože kroz dan.",
  },
  {
    id: 3,
    image: assets.girl_with_crema_image,
    title: "Kreme za svakodnevnu njegu",
    description: "Hranljive teksture koje obnavljaju i zadržavaju vlagu.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Izdvojeni proizvodi</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <Link
                href="/prodavnica"
                className="inline-flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded"
              >
                Kupi sada
                <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
