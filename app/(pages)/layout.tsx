"use client";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className=" min-h-fit gap-6 gap-x-8 py-12 w-[1200px] mx-auto flex flex-col items-start">
        {children}
      </div>
    </main>
  );
}
