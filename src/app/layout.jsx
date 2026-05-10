import './globals.css'

export const metadata = {
  title: 'El Fuego — Mexican Street Grill',
  description: 'O melhor Mexican grill da cidade. Tacos, burritos, quesadillas e muito mais. Peça agora pelo cardápio digital.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111111',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌮</text></svg>" />
      </head>
      <body className="bg-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
