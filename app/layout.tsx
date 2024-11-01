import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { clientConfig, serverConfig } from "@/config";
import { cookies } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";
import { AuthProvider } from "@/providers/auth-provider";
import { AudioProvider } from "@/components/timeline/audio-context";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FAB CALLS Demo",
  description: "This is just a demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster position="top-right" />
        <AuthProvider initialAuth={!!tokens}>
          <AudioProvider>{children}</AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
