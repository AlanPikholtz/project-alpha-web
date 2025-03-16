"use client";

import { Geist } from "next/font/google";
import "./ui/globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "./lib/store/store";
import { PersistGate } from "redux-persist/integration/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Provider store={store}>
          <PersistGate loading={<div>Loading</div>} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
