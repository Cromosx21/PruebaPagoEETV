import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Schedule from './components/Schedule.jsx'
import Plans from './components/Plans.jsx'
import Steps from './components/Steps.jsx'
import Stats from './components/Stats.jsx'
import Footer from './components/Footer.jsx'
import Subscribe from './components/Subscribe.jsx'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Schedule />
        <Plans />
        <Subscribe />
        <Steps />
      </main>
      <Footer />
    </div>
  )
}

export default App
