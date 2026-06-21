import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GiftCardPage from './pages/GiftCardPage.tsx'
import PresentsPage from './pages/PresentsPage.tsx'
import PaymentResult from './pages/PaymentResult.tsx'
import './index.css'

const pathname = window.location.pathname

function Root() {
  if (pathname === '/cartao') return <GiftCardPage />
  if (pathname === '/presentes') return <PresentsPage />
  if (pathname.startsWith('/pagamento/')) return <PaymentResult />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
