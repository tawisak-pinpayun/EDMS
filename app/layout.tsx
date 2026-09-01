import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/**
 * ฟอนต์หลักของแอปพลิเคชั่น
 */
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'EDMS - จัดการข้อมูล Excel',
  description: 'ระบบจัดการข้อมูลจากไฟล์ Excel ด้วย Next.js + MongoDB',
};

/**
 * Layout หลักของทั้งแอป
 * @param children คอมโพเนนต์ลูกทีจะถูกแสดงใน layout
 * @returns JSX Element
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
