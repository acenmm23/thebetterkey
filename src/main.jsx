import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './product-refresh.css'
import './scroll-effects.css'
import './hero-motion.css'
import './hero-handoff.js'
import './demo-refresh.css'
import './demo-zoom.css'
import './demo-interactive.css'
import './demo-mesh.css'
import { initBrandMotion } from './brand-motion.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// React 18 may commit the root after this module has evaluated. Give it a
// frame before querying the DOM for motion targets so the animation system is
// deterministic on both fast and slow devices.
window.requestAnimationFrame(() => {
  window.requestAnimationFrame(initBrandMotion)
})
