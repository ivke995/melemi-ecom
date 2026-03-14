"use client";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import { socialLinks } from "@/components/contactLinks";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navLinks = [
    { label: "Početna", href: "/" },
    { label: "Prodavnica", href: "/prodavnica" },
    { label: "O nama", href: "/o-nama" },
    { label: "Kontakt", href: "/kontakt" },
  ];

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-gray-900 transition"
          >
            {link.label}
          </Link>
        ))}

        {isSeller && (
          <button
            onClick={() => router.push("/prodavac")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Panel prodavca
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-gray-500 hover:text-gray-900 transition"
              target="_blank"
              rel="noreferrer"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <button
          onClick={() => router.push("/korpa")}
          aria-label="Korpa"
          className="relative flex items-center justify-center"
        >
          <span className="scale-110">
            <CartIcon />
          </span>
          {getCartCount() > 0 && (
            <span className="absolute -right-2 -top-2 min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Korpa"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/korpa")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Moje narudžbe"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/moje-narudzbe")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image className="w-5 h-5" src={assets.user_icon} alt="user icon" />
            Nalog
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/prodavac")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Panel prodavca
          </button>
        )}
        <button
          onClick={() => router.push("/korpa")}
          aria-label="Korpa"
          className="relative flex items-center justify-center"
        >
          <span className="scale-110">
            <CartIcon />
          </span>
          {getCartCount() > 0 && (
            <span className="absolute -right-2 -top-2 min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Početna"
                labelIcon={<HomeIcon />}
                onClick={() => router.push("/")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Proizvodi"
                labelIcon={<BoxIcon />}
                onClick={() => router.push("/prodavnica")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Korpa"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/korpa")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Moje narudžbe"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/moje-narudzbe")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image className="w-5 h-5" src={assets.user_icon} alt="user icon" />
            Nalog
          </button>
        )}
        <button
          type="button"
          aria-controls="mobile-nav"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <Image className="w-5 h-5" src={assets.menu_icon} alt="menu icon" />
        </button>
      </div>
      <div
        id="mobile-nav"
        aria-hidden={!isMenuOpen}
        className={`md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-sm transition-all duration-200 z-20 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3 px-6 py-4 text-sm text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-900 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-500 hover:text-gray-900 transition"
                target="_blank"
                rel="noreferrer"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
