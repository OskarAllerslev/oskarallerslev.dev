import React from 'react';

const StatProgressBar = ({ label, value, color }) => (
	<div>
		<div className="flex items-center justify-between text-xs">
			<span className={color}>{label}</span>
			<span className="font-mono text-zinc-300">{value}</span>
		</div>
		<div className="mt-1 h-1.5 w-full rounded-full bg-white/5">
			<div
				className={`h-1.5 rounded-full ${color.replace('text-', 'bg-')}`}
				style={{ width: `${(value / 34) * 100}%` }}
			></div>
		</div>
	</div>
);

export default function LeetCodeCard() {
	return (
		<div className="flex h-full flex-col justify-between space-y-4">
			<div className="flex items-center justify-between">
				<span className="text-[11px] text-zinc-550 font-mono uppercase tracking-wider">Metrics Snapshot</span>
				<a
					href="https://leetcode.com/oskarallerslev/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs text-zinc-400 transition-colors hover:text-teal-400"
				>
					View Profile &rarr;
				</a>
			</div>

			<div className="flex items-center gap-6">
				{/* Total Solved */}
				<div className="flex flex-col items-center justify-center shrink-0">
					<p className="text-4xl font-extrabold text-zinc-100 font-mono">34</p>
					<p className="text-[10px] text-zinc-500 uppercase tracking-wider">Solved</p>
				</div>

				{/* Breakdown */}
				<div className="w-full flex-1 space-y-2">
					<StatProgressBar label="Easy" value={30} color="text-green-400" />
					<StatProgressBar label="Medium" value={4} color="text-yellow-500" />
					<StatProgressBar label="Hard" value={0} color="text-red-500" />
				</div>
			</div>

			<div className="border-t border-zinc-850 pt-3">
				<h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono mb-2">Top Languages</h5>
				<div className="grid grid-cols-2 gap-3 p-2 bg-zinc-950/40 rounded-lg border border-zinc-800/50 text-xs">
					<div className="flex items-center justify-between px-1.5 font-mono text-[11px] text-zinc-300">
						<span className="text-zinc-500">C++</span>
						<span className="font-semibold text-zinc-100">24</span>
					</div>
					<div className="flex items-center justify-between px-1.5 font-mono text-[11px] text-zinc-300">
						<span className="text-zinc-500">Rust</span>
						<span className="font-semibold text-zinc-100">11</span>
					</div>
				</div>
			</div>
		</div>
	);
}
