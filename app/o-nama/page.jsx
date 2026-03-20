import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutUsImage from "@/assets/about_us.png";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "O nama",
  description:
    "Porodična proizvodnja prirodnih melema, ručno rađenih preparata i tradicionalne biljne njege.",
  alternates: {
    canonical: "/o-nama",
  },
  openGraph: {
    title: "O nama",
    description:
      "Porodična proizvodnja prirodnih melema, ručno rađenih preparata i tradicionalne biljne njege.",
    url: `${baseUrl}/o-nama`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "O nama",
    description:
      "Porodična proizvodnja prirodnih melema, ručno rađenih preparata i tradicionalne biljne njege.",
  },
};

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32">
        <section className="mt-10 mb-16 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/70 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col items-end">
            <p className="text-2xl font-medium text-gray-900">O nama</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start mt-8">
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Bojana melemi je mala porodična proizvodnja prirodnih preparata
                nastalih iz ljubavi prema prirodi i tradicionalnoj biljnoj
                medicini. Još od 2011. godine, Bojana Arambašić izrađuje meleme
                koristeći pažljivo odabrane ljekovite biljke i provjerene
                recepture koje se prenose generacijama.
              </p>
              <p>
                Bilje koje koristimo sakuplja se na čistim planinskim livadama i
                visoravnima, daleko od zagađenja, gdje priroda ostaje netaknuta.
                Svaki proizvod nastaje ručno, u manjim količinama, kako bi se
                očuvala kvaliteta sastojaka i prirodna svojstva biljaka.
              </p>
              <p>
                U našim melemima koristimo jednostavne i prirodne sastojke poput
                pčelinjeg voska, maslinovog ulja i različitih ljekovitih biljaka
                poznatih po svojim blagotvornim svojstvima. Naš cilj je ponuditi
                proizvode koji pružaju prirodnu njegu kože i podršku zdravlju,
                oslanjajući se na snagu biljaka i iskustvo tradicionalne
                pripreme.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-100/70 via-white to-emerald-100/70 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-3xl border border-amber-100/70 bg-white shadow-lg">
                <Image
                  src={aboutUsImage}
                  alt="Bojana melemi prirodni preparati"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-l-4 border-orange-600/80 bg-white/80 p-5 text-gray-700 shadow-sm">
            <p>
              Vjerujemo da prirodna rješenja mogu biti jednostavna, učinkovita
              i dostupna svima koji žele brinuti o svom tijelu na prirodan način.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
