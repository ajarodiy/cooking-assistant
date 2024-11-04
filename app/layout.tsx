import type { Metadata } from "next";
import Home from "./page";
import { Toaster } from 'sonner'
import "./globals.css";

export const metadata: Metadata = {
  title: "Cooking Assistant",
  description: "A cooking assistant bot to help with all your cooking needs",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <Home />
        <Toaster />
      </body>
    </html>
  );
}
