import { useEffect, useState } from 'react'
import Gallery from './Gallery'
import AddSubscription from './prototype/AddSubscription'

// Hash routing keeps the build static-host friendly: "#components" shows the gallery, anything else the prototype.
const routeFromHash = () => (window.location.hash === '#components' ? 'components' : 'prototype')

export default function App() {
  const [route, setRoute] = useState(routeFromHash)

  useEffect(() => {
    const onHash = () => {
      setRoute(routeFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route === 'components' ? <Gallery /> : <AddSubscription />
}
