import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'))
if (window.location.pathname.replace(/\/+$/, '').startsWith('/admin')) {
  import('./Admin.jsx').then(({ default: Admin }) => root.render(<Admin />))
} else {
  Promise.all([import('./App.jsx'), import('./styles.css')]).then(([{ default: App }]) => root.render(<App />))
}
