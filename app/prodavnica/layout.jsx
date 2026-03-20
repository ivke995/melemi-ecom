const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Prodavnica",
  description: "Pregled svih prirodnih melema, balzama i proizvoda za njegu tijela.",
  alternates: {
    canonical: "/prodavnica",
  },
  openGraph: {
    title: "Prodavnica",
    description: "Pregled svih prirodnih melema, balzama i proizvoda za njegu tijela.",
    url: `${baseUrl}/prodavnica`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prodavnica",
    description: "Pregled svih prirodnih melema, balzama i proizvoda za njegu tijela.",
  },
};

export default function ProdavnicaLayout({ children }) {
  return children;
}
