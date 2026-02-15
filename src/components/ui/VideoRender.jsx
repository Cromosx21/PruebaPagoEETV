import { useState } from "react";

const VideoRender = ({ videoId, title }) => {
	const [loadVideo, setLoadVideo] = useState(false);

	return (
		<div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group">
			{loadVideo ? (
				<iframe
					className="w-full h-full"
					src={`https://www.youtube.com/embed/videoseries?list=${videoId}&autoplay=1&rel=0`}
					title={title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			) : (
				<button
					onClick={() => setLoadVideo(true)}
					className="w-full h-full relative flex items-center justify-center overflow-hidden group"
				>
					<img
						src="/ClassYoutube.png"
						alt={title}
						className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					<div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
					<div className="relative z-10 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-red-500">
						<div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[18px] border-l-white ml-1"></div>
					</div>
				</button>
			)}
		</div>
	);
};

export default VideoRender;
