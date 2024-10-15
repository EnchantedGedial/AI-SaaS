import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ClerkProvider } from '@clerk/nextjs'


const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'
});

export const metadata = {
  title: "AI SaaS",
  description: "Get the power of AI at tip of your finger",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
       <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
