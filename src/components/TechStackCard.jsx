import React from 'react';

const TechItem = ({ name, detail, color }) => (
	<div className="flex items-center justify-between rounded-md bg-zinc-900/50 p-3 transition-all duration-300 group-hover:bg-zinc-800/50">
		<span className={`font-mono text-sm font-semibold ${color}`}>{name}</span>
		{detail && <span className="text-xs text-zinc-400">{detail}</span>}
	</div>
);

export default function TechStackCard() {
	return (
		<div className="flex h-full flex-col">
			<h4 className="text-lg font-bold text-zinc-100">Core Toolkit</h4>
			<div className="mt-4 flex flex-grow flex-col justify-center gap-3">
				<TechItem name="C++" color="text-blue-400" />
				<TechItem name="Rust" color="text-orange-400" />
				<TechItem name="R" color="text-sky-400" />
				<TechItem name="Python" color="text-yellow-400" />
				<TechItem name="Neovim" detail="LazyVim" color="text-green-400" />
			</div>
		</div>
	);
}
