import React from 'react';

export default function ProfileImageCard() {
	return (
		<div className="relative h-full w-full">
			<img
				src="/profile.jpg"
				alt="Oskar Allerslev"
				className="h-full w-full object-cover grayscale contrast-[1.1] brightness-[0.8] mix-blend-luminosity"
			/>
			<div className="absolute bottom-4 left-4 flex items-center rounded-full bg-black/50 p-1 pr-3 text-xs font-medium text-zinc-200 backdrop-blur-sm">
				<span className="relative mr-2 flex h-3 w-3">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
					<span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
				</span>
				Based in Copenhagen
			</div>
		</div>
	);
}
