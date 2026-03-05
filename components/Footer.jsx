import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Lorem Ipsum je jednostavan probni tekst štamparske i slovoslagačke
            industrije. Lorem Ipsum je standardni probni tekst u industriji još
            od 1500-ih, kada je nepoznati štampar uzeo slagalicu slova i
            izmiješao je kako bi napravio knjigu uzorka slova.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Kompanija</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Početna</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">O nama</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Kontakt</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Politika privatnosti</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Kontaktirajte nas</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@greatstack.dev</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © GreatStack.dev Sva prava zadržana.
      </p>
    </footer>
  );
};

export default Footer;
