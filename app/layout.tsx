// app/layout.tsx
import Header from "./Header";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata = {
  title: "Starlink Launch Statistics",
  description: "Starlink Launch Statistics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
