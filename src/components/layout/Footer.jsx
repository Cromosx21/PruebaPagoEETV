import LogoEETV from "/LogoEETV.svg";
import IcoFacebook from "../../assets/SocialMedia/IcoFacebook.svg?react";
import IcoInstagram from "../../assets/SocialMedia/IcoInstagram.svg?react";
import IcoTikTok from "../../assets/SocialMedia/IcoTiktok.svg?react";
import IcoYouTube from "../../assets/SocialMedia/IcoYoutube.svg?react";

export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
				<div className="grid gap-8 md:grid-cols-3 items-start">
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<img
								src={LogoEETV}
								alt="Logo EasyEnglishTV"
								className="h-12"
							/>
						</div>
						<p className="text-sm text-slate-600 max-w-xs">
							EasyEnglishTV es una comunidad para aprender inglés
							de forma divertida con clases en vivo y material
							exclusivo.
						</p>
					</div>
					<div className="flex flex-col gap-2 text-sm text-slate-600">
						<h3 className="font-semibold text-slate-800">
							Información legal
						</h3>
						<a
							href="/terminos-y-condiciones"
							className="hover:text-primary"
						>
							Términos y condiciones
						</a>
						<a
							href="/politica-de-privacidad"
							className="hover:text-primary"
						>
							Política de privacidad
						</a>
						<a
							href="/politica-de-cookies"
							className="hover:text-primary"
						>
							Política de cookies
						</a>
					</div>
					<div className="flex flex-col gap-3 text-sm text-slate-600">
						<h3 className="font-semibold text-slate-800">
							Síguenos
						</h3>
						<div className="flex items-center gap-4">
							<a
								className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
								href="https://www.youtube.com/channel/UCzxP2uldBPoaOdS-vhuGYzg/join"
								target="_blank"
								rel="noreferrer"
								aria-label="Suscribirse en YouTube"
							>
								<IcoYouTube className="w-9 h-9 text-neutral-900" />
							</a>
							<a
								className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
								href="https://www.facebook.com/EasyEnglishTv.1"
								target="_blank"
								rel="noreferrer"
								aria-label="Página de Facebook"
							>
								<IcoFacebook className="w-9 h-9 text-neutral-900" />
							</a>
							<a
								className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
								href="https://www.instagram.com/easyenglishtv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
								target="_blank"
								rel="noreferrer"
								aria-label="Perfil de Instagram"
							>
								<IcoInstagram className="w-9 h-9 text-neutral-900" />
							</a>
							<a
								className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
								href="https://www.tiktok.com/@easyenglishtvtiktok?is_from_webapp=1&sender_device=pc"
								target="_blank"
								rel="noreferrer"
								aria-label="Perfil de TikTok"
							>
								<IcoTikTok className="w-9 h-9 text-neutral-900" />
							</a>
						</div>
						<p className="text-xs text-slate-500">
							Contenido educativo en línea desde Perú para toda
							Hispanoamérica.
						</p>
					</div>
				</div>
				<div className="mt-8 border-t pt-4 text-center text-xs text-slate-500">
					© {new Date().getFullYear()} EasyEnglishTV. Todos los
					derechos reservados.
				</div>
			</div>
		</footer>
	);
}
