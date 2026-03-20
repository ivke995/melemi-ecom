import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactPhone, socialLinks } from "@/components/contactLinks";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte Melemi Bojana za preporuku melema, informacije o narudžbama i podršku.",
  alternates: {
    canonical: "/kontakt",
  },
  openGraph: {
    title: "Kontakt",
    description:
      "Kontaktirajte Melemi Bojana za preporuku melema, informacije o narudžbama i podršku.",
    url: `${baseUrl}/kontakt`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kontakt",
    description:
      "Kontaktirajte Melemi Bojana za preporuku melema, informacije o narudžbama i podršku.",
  },
};

const Contact = () => {
  const contactEmail = "bojanamelemi@gmail.com";

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32">
        <section className="mt-10 mb-16 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50/70 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col items-end">
            <p className="text-2xl font-medium text-gray-900">Kontakt</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start mt-8">
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Ako imate pitanja o melemima, narudžbama ili preporukama, tu smo
                da pomognemo. Rado ćemo podijeliti savjet i iskustvo iz
                tradicionalne pripreme.
              </p>
              <p>
                Najbrže odgovaramo putem telefona, a dostupni smo i na Viberu i
                WhatsAppu. Možete nam pisati i putem emaila.
              </p>
              <div className="mt-6 border-l-4 border-orange-600/80 bg-white/80 p-5 text-gray-700 shadow-sm">
                <p>
                  Javite se kad god vam zatreba prirodna preporuka ili pomoć pri
                  izboru melema.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <a
                    className="text-gray-900 font-medium hover:text-orange-600 transition"
                    href={`tel:${contactPhone}`}
                  >
                    {contactPhone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    className="text-gray-900 font-medium hover:text-orange-600 transition"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Društvene mreže</p>
                  <div className="flex items-center gap-3 mt-2 text-gray-500">
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
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
