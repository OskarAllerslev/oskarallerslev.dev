import React from 'react';

const technologies = [
	{ name: 'C++', color: 'text-blue-400' },
	{ name: 'Rust', color: 'text-orange-400' },
	{ name: 'R', color: 'text-sky-400' },
	{ name: 'Python', color: 'text-yellow-400' },
	{ name: 'Neovim', color: 'text-green-400' },
];

export default function TechStackCard() {
	return (
		<div className="flex h-full flex-col">
			<h4 className="text-lg font-bold text-zinc-100">Core Toolkit</h4>
			<div className="mt-4 flex flex-grow flex-wrap content-center justify-center gap-4 py-4">
				{technologies.map((tech) => (
					<div
						key={tech.name}
						className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10 text-sm font-semibold"
					>
						<span className={tech.color}>{tech.name}</span>
					</div>
				))}
			</div>
		</div>
	);
}
