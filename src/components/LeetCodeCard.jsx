import React from 'react';

const LeetCodeStat = ({ value, label, color }) => (
	<div className="text-center">
		<p className={`text-3xl font-bold ${color}`}>{value}</p>
		<p className="text-xs text-zinc-400">{label}</p>
	</div>
);

export default function LeetCodeCard() {
	return (
		<div className="flex h-full flex-col justify-between">
			<div>
				<div className="flex items-center justify-between">
					<h4 className="text-lg font-bold text-zinc-100">LeetCode Stats</h4>
					<a
						href="https://leetcode.com/oskarallerslev/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-zinc-400 transition-colors hover:text-teal-400"
					>
						View Profile &rarr;
					</a>
				</div>
				<p className="mt-2 text-sm text-zinc-400 line-clamp-2">
					Consistent problem-solving with a focus on performant, low-level languages.
				</p>
			</div>

			<div className="mt-6 grid grid-cols-3 gap-4">
				<LeetCodeStat value="150+" label="Solved" color="text-teal-400" />
				<LeetCodeStat value="70+" label="Medium" color="text-yellow-400" />
				<LeetCodeStat value="25+" label="Hard" color="text-red-500" />
			</div>

			<div className="mt-auto pt-4 text-center">
				<p className="text-sm font-semibold text-zinc-300">Primary Languages</p>
				<div className="mt-2 flex justify-center gap-2">
					<span className="rounded bg-zinc-800 px-2 py-1 font-mono text-xs font-medium text-teal-400">
						Rust
					</span>
					<span className="rounded bg-zinc-800 px-2 py-1 font-mono text-xs font-medium text-teal-400">
						C++
					</span>
				</div>
			</div>
		</div>
	);
}
