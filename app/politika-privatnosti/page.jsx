"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32">
        <section className="mt-10 mb-16 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50/70 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col items-end">
            <p className="text-2xl font-medium text-gray-900">
              Politika privatnosti
            </p>
            <div className="w-20 h-0.5 bg-orange-600 rounded-full"></div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h3 className="text-lg font-medium text-gray-900">1. Uvod</h3>
                <p className="mt-2">
                  Ova politika privatnosti objašnjava koje podatke prikupljamo
                  na veb-sajtu Melemi Bojana, zašto ih koristimo i na koji način
                  ih štitimo. Korištenjem sajta prihvatate ovu politiku.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  2. Podaci koje prikupljamo
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    Podaci o nalogu: ime, email adresa i profilna slika koje
                    dobijamo preko Clerk autentikacije.
                  </li>
                  <li>
                    Podaci za dostavu: puno ime, broj telefona, adresa (naselje
                    i ulica), poštanski broj, grad/opština i država.
                  </li>
                  <li>
                    Podaci o narudžbi: odabrani proizvodi, količine, iznos,
                    status narudžbe i datum kreiranja.
                  </li>
                  <li>
                    Podaci o korpi: sadržaj korpe za goste čuvamo lokalno u
                    pregledaču (localStorage).
                  </li>
                  <li>
                    Analitički podaci: osnovne informacije o posjeti i načinu
                    korištenja sajta kroz Vercel Analytics.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  3. Kako koristimo podatke
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>Da obradimo narudžbe i organizujemo dostavu.</li>
                  <li>Da omogućimo upravljanje nalozima i adresama.</li>
                  <li>
                    Da obezbijedimo korisničku podršku i odgovorimo na upite.
                  </li>
                  <li>
                    Da unaprijedimo sajt, sadržaj i iskustvo kupovine.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  4. Analitika i kolačići
                </h3>
                <p className="mt-2">
                  Koristimo Vercel Analytics kako bismo razumjeli osnovne
                  trendove posjeta i performanse stranica. Ovi podaci su
                  agregirani i koriste se za poboljšanje korisničkog iskustva.
                  Autentikacija preko Clerk-a može koristiti kolačiće ili slične
                  tehnologije za održavanje sesije.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  5. Dijeljenje podataka
                </h3>
                <p className="mt-2">
                  Vaše podatke ne prodajemo. Dijelimo ih samo kada je to
                  potrebno za funkcionisanje sajta i obradu narudžbi, npr. sa
                  provajderima autentikacije (Clerk) i analitike (Vercel
                  Analytics), ili kada je to zakonski obavezno.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  6. Čuvanje i sigurnost
                </h3>
                <p className="mt-2">
                  Podatke čuvamo onoliko dugo koliko je potrebno za ispunjenje
                  svrhe zbog koje su prikupljeni ili koliko to zahtijeva zakon.
                  Primjenjujemo razumne mjere zaštite kako bismo spriječili
                  neovlašten pristup.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  7. Vaša prava
                </h3>
                <p className="mt-2">
                  Imate pravo da zatražite pristup, ispravku ili brisanje svojih
                  podataka, kao i ograničenje obrade. Za sva pitanja ili
                  zahtjeve, kontaktirajte nas putem emaila.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">
                Brzi pregled
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  Prikupljamo podatke potrebne za narudžbu i dostavu proizvoda.
                </li>
                <li>Analitiku koristimo samo za poboljšanje sajta.</li>
                <li>Korpa za goste se čuva lokalno u pregledaču.</li>
                <li>Podatke ne prodajemo trećim stranama.</li>
              </ul>

              <div className="mt-6 border-l-4 border-orange-600/80 bg-orange-50/60 p-4 text-sm text-gray-700">
                <p>
                  Kontakt za privatnost:{" "}
                  <a
                    href="mailto:bojanamelemi@gmail.com"
                    className="font-medium text-gray-900 hover:text-orange-600 transition"
                  >
                    bojanamelemi@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
