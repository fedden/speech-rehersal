import './globals.css'

export const metadata = {
  title: 'My Next.js Site',
  description: 'Created with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 