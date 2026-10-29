import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./shared/layout/Header";
import InitAnims from "./shared/initAnims";
import Boot from "./shared/Boot";
import Display from "./shared/Display";

export const metadata = {
  title: "npmart",
  description: "An e-commerce website for learning Node.js :3",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
        <InitAnims />
       
      <body >
        <Display>
         {/* <Boot></Boot> */}
        <div className="h-screen w-screen font-mono flex flex-col bg-gray-800 overflow-hidden">

        <div className="shrink-0 z-1">
          <Header />
        </div>


        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        </div>
        </Display>
      </body>
    </html>
  );
}