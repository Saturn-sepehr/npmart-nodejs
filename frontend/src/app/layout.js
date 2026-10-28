import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./shared/layout/Header";
import InitAnims from "./shared/initAnims";


export const metadata = {
  title: "e-commerce student website",
  description: "An e-commerce website made with node.js and next.js using gclass-anims to both learn node.js and to test gclass-anims in an actual website :3",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <InitAnims></InitAnims>
      <body className="min-h-full font-mono flex flex-col bg-gray-800">
        <Header></Header>
        {children}
        </body>
    </html>
  );
}
