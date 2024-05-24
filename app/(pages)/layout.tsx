"use client";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header absolute type="edit" />
      <div className="box-border min-h-[100vh] gap-6 gap-x-8 w-[1200px] mx-auto flex flex-col items-start">
        {children}
      </div>
    </main>
  );
}
