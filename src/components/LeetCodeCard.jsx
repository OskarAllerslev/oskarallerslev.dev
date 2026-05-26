import React from 'react';

const StatProgressBar = ({ label, value, color }) => (
	<div>
		<div className="flex items-center justify-between text-sm">
			<span className={color}>{label}</span>
			<span className="font-mono text-zinc-300">{value}</span>
		</div>
		<div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
			<div
				className={`h-1.5 rounded-full ${color.replace('text-', 'bg-')}`}
				style={{ width: `${(value / 34) * 100}%` }}
			></div>
		</div>
	</div>
);

export default function LeetCodeCard() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-start justify-between">
				<div>
					<h4 className="text-lg font-bold text-zinc-100">LeetCode Stats</h4>
					<p className="mt-1 text-xs text-zinc-400">Statisk øjebliksbillede</p>
				</div>
				<a
					href="https://leetcode.com/oskarallerslev/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs text-zinc-400 transition-colors hover:text-teal-400"
				>
					View Profile &rarr;
				</a>
			</div>

			<div className="my-6 flex flex-grow items-center gap-6">
				{/* Total Solved */}
				<div className="flex flex-col items-center justify-center">
					<p className="text-6xl font-bold text-zinc-100">34</p>
					<p className="mt-1 text-sm text-zinc-400">Solved</p>
				</div>

				{/* Breakdown */}
				<div className="w-full flex-1 space-y-3">
					<StatProgressBar label="Easy" value={30} color="text-green-400" />
					<StatProgressBar label="Medium" value={4} color="text-yellow-500" />
					<StatProgressBar label="Hard" value={0} color="text-red-500" />
				</div>
			</div>

			<div className="mt-auto border-t border-white/10 pt-4">
				<h5 className="text-sm font-semibold text-zinc-300">Top Languages</h5>
				<div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
					<div>
						C++: <span className="font-mono font-semibold text-zinc-200">24</span>
					</div>
					<div>
						Rust: <span className="font-mono font-semibold text-zinc-200">11</span>
					</div>
				</div>
			</div>
		</div>
	);
}
