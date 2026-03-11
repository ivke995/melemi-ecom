import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { contactPhone, socialLinks } from "@/components/contactLinks";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Bojana Melemi je mala radionica prirodne njege kože. Ručno pravimo
            meleme i balzame u malim serijama, birajući provjerene sastojke i
            jasne formule. Fokusirani smo na kvalitet, sigurnost i jednostavnu
            svakodnevnu rutinu.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Kompanija</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" href="/">Početna</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/o-nama">O nama</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/kontakt">Kontakt</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="#">Politika privatnosti</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Kontaktirajte nas</h2>
            <div className="text-sm">
              <div className="space-y-2">
                <a
                  className="block hover:text-gray-900 transition"
                  href={`tel:${contactPhone}`}
                >
                  {contactPhone}
                </a>
                <a
                  className="block hover:text-gray-900 transition"
                  href="mailto:bojanamelemi@gmail.com"
                >
                  bojanamelemi@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 mt-4 text-gray-500">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="hover:text-gray-900 transition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © Bojana Melemi Sva prava zadržana.
      </p>
    </footer>
  );
};

export default Footer;
