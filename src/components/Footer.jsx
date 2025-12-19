import LogoEETV from "../../public/LogoEETV.svg";
import IcoFacebook from "../../public/SocialMedia/IcoFacebook.svg?react";
import IcoInstagram from "../../public/SocialMedia/IcoInstagram.svg?react";
import IcoTikTok from "../../public/SocialMedia/IcoTiktok.svg?react";
import IcoYouTube from "../../public/SocialMedia/IcoYoutube.svg?react";

export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<img
							src={LogoEETV}
							alt="Logo EasyEnglishTV"
							className="h-12"
						/>
					</div>
					<div className="flex items-center gap-4">
						<a
							className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
							href="https://www.youtube.com/channel/UCzxP2uldBPoaOdS-vhuGYzg/join"
							target="_blank"
							rel="noreferrer"
						>
							<IcoYouTube className="w-12 h-12 text-neutral-900" />
						</a>
						<a
							className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
							href="https://www.facebook.com/EasyEnglishTv.1"
							target="_blank"
							rel="noreferrer"
						>
							<IcoFacebook className="w-12 h-12 text-neutral-900" />
						</a>
						<a
							className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
							href="https://www.instagram.com/easyenglishtv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
							target="_blank"
							rel="noreferrer"
						>
							<IcoInstagram className="w-12 h-12 text-neutral-900" />
						</a>
						<a
							className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-lg hover:drop-shadow-neutral-800"
							href="https://www.tiktok.com/@easyenglishtvtiktok?is_from_webapp=1&sender_device=pc"
							target="_blank"
							rel="noreferrer"
						>
							<IcoTikTok className="w-12 h-12 text-neutral-900" />
						</a>
					</div>
				</div>
				<div className="mt-6 text-center text-sm text-slate-600">
					© {new Date().getFullYear()} EasyEnglishTV. Todos los
					derechos reservados.
				</div>
			</div>
		</footer>
	);
}
