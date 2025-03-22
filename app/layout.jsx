import './globals.css'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'Speech Practice',
  description: 'Practice your speech with confidence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 