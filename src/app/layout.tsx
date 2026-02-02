import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";

export const metadata: Metadata = {
  title: "VyaparHub",
  description: "Multi-vendor E-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <StoreProvider>
        {children}
        </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
