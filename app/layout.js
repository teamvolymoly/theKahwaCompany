import "./globals.css";
import { Inter, Baskervville } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import Footer from "@/components/Footer";
import NewHeader from "@/components/NewHeader";
import ToastHost from "@/components/ToastHost";
import SiteLoader from "@/components/SiteLoader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-basker",
  display: "swap",
});

export const metadata = {
  title: "The Kahwa Co. | Tea, Tradition & Everyday Wellness",
  description:
    "Experience premium kahwa and herbal blends that bring together traditional ingredients, rich flavor, and mindful living.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${baskervville.variable} antialiased`}
      >
        <AuthProvider>
          <SiteLoader />
          <NewHeader />
          <ToastHost />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
