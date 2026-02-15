import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import Schedule from "./components/sections/Schedule.jsx";
import Plans from "./components/sections/Plans.jsx";
import Steps from "./components/sections/Steps.jsx";
import Stats from "./components/sections/Stats.jsx";
import Subscribe from "./components/sections/Subscribe.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Cookies from "./pages/Cookies.jsx";
import NotFound from "./pages/NotFound.jsx";

function HomePage() {
	return (
		<>
			<Hero />
			<Stats />
			<Schedule />
			<Steps />
			<Plans />
			<Subscribe />
		</>
	);
}

function App() {
	const path = window.location.pathname || "/";

	let content;

	if (path === "/") {
		content = <HomePage />;
	} else if (path === "/terminos-y-condiciones") {
		content = <Terms />;
	} else if (path === "/politica-de-privacidad") {
		content = <Privacy />;
	} else if (path === "/politica-de-cookies") {
		content = <Cookies />;
	} else {
		content = <NotFound />;
	}

	return (
		<div className="min-h-screen bg-light">
			<Navbar />
			<main>{content}</main>
			<Footer />
		</div>
	);
}

export default App;
