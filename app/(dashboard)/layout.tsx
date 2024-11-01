import dynamic from "next/dynamic";

const DynamicLayout = dynamic(
  () => import("@/components/layout/dynamic-layout"),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DynamicLayout>{children}</DynamicLayout>
    </main>
  );
}
