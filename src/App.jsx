import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import Schedule from './components/sections/Schedule.jsx'
import Plans from './components/sections/Plans.jsx'
import Steps from './components/sections/Steps.jsx'
import Stats from './components/sections/Stats.jsx'
import Subscribe from './components/sections/Subscribe.jsx'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Schedule />
        <Steps />
        <Plans />
        <Subscribe />
      </main>
      <Footer />
    </div>
  )
}

export default App
