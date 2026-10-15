import React from 'react';

export default function ProfileImageCard() {
	return (
		<div className="group relative h-full w-full">
			<img
				src="/profile.jpg"
				alt="Oskar Allerslev"
				className="h-full w-full object-cover grayscale contrast-[1.05] brightness-[0.85] transition duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:brightness-100"
			/>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
			<div className="absolute bottom-3 left-3 flex items-center rounded-full border border-white/10 bg-black/50 py-1 pl-2 pr-3 text-[11px] font-medium text-zinc-200 backdrop-blur-md">
				<span className="relative mr-2 flex h-2.5 w-2.5">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
					<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
				</span>
				Based in Copenhagen
			</div>
		</div>
	);
}
