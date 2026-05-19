import React, { useState, useMemo } from 'react';
import pkg from 'react-katex';
const { BlockMath, InlineMath } = pkg;
// A simple function to generate an approximate Fractional Brownian Motion path
// This is for visualization purposes and not a rigorous simulation.
const generateFbmPath = (hurst, points, width, height) => {
	const path = [{ x: 0, y: height / 2 }];
	let lastY = height / 2;

	for (let i = 1; i < points; i++) {
		// Influence of previous step depends on H
		const innovation = (Math.random() - 0.5) * 2 * 1.5; // Visual scaling
		const drift = (hurst - 0.5) * (path[i - 1].y - height / 2) * 0.1;
		let newY = lastY - drift + innovation;

		// Clamp to viewbox
		if (newY < 10) newY = 10;
		if (newY > height - 10) newY = height - 10;

		path.push({ x: (i / (points - 1)) * width, y: newY });
		lastY = newY;
	}
	return path.map((p) => `${p.x},${p.y}`).join(' ');
};

export default function FbmSimulator() {
	const [hurst, setHurst] = useState(0.2);
	const [pathKey, setPathKey] = useState(0); // Used to force regeneration

	const width = 600;
	const height = 300;
	const points = 200;

	const pathData = useMemo(() => generateFbmPath(hurst, points, width, height), [hurst, pathKey]);

	return (
		<div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
			<div className="border-b border-zinc-800 pb-4">
				<svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded-lg bg-zinc-950 border border-zinc-800">
					{/* Grid lines */}
					{[...Array(10)].map((_, i) => (
						<line
							key={`v-${i}`}
							x1={(width / 10) * (i + 1)}
							y1="0"
							x2={(width / 10) * (i + 1)}
							y2={height}
							stroke="rgba(255, 255, 255, 0.05)"
							strokeWidth="1"
						/>
					))}
					{[...Array(5)].map((_, i) => (
						<line
							key={`h-${i}`}
							x1="0"
							y1={(height / 5) * (i + 1)}
							x2={width}
							y2={(height / 5) * (i + 1)}
							stroke="rgba(255, 255, 255, 0.05)"
							strokeWidth="1"
						/>
					))}
					{/* Path */}
					<polyline
						points={pathData}
						fill="none"
						stroke="rgb(20 184 166)" // teal-500
						strokeWidth="1.5"
						style={{ filter: 'drop-shadow(0 0 5px rgb(20 184 166 / 0.7))' }}
					/>
				</svg>
				<div className="mt-2 rounded-md border border-amber-600/30 bg-amber-950/20 p-2 text-center text-xs text-amber-400">
					<span className="font-bold">[PROXY MODE]</span> This is a client-side JavaScript
					visualization. The actual high-performance Monte Carlo SDE engine runs in C++.
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="flex-1">
					<label htmlFor="hurst-slider" className="block text-sm font-medium text-zinc-300">
						Hurst Parameter (H): {hurst.toFixed(2)}
					</label>
					<input
						id="hurst-slider"
						type="range"
						min="0.05"
						max="0.95"
						step="0.01"
						value={hurst}
						onChange={(e) => setHurst(parseFloat(e.target.value))}
						className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-teal-500"
					/>
				</div>
				<button
					onClick={() => setPathKey((k) => k + 1)}
					className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700"
				>
					Regenerate Path
				</button>
			</div>

			<div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
				<h5 className="text-base font-semibold text-zinc-100">Theory & Methodology</h5>
				<p className="mt-2 text-sm text-zinc-400">
					Financial volatility and electricity spot prices often exhibit "roughness," a statistical
					property where the Hurst parameter <InlineMath math="H < 0.5" />. This violates the
					assumptions of standard Brownian motion (<InlineMath math="H = 0.5" />) used in models
					like Black-Scholes. Rough volatility models use Fractional Brownian Motion (fBM) to capture
					this behavior, requiring specialized SDE solvers.
				</p>
				<div className="mt-4 space-y-4 text-sm">
					<div>
						<h6 className="font-semibold text-zinc-300">Stochastic Differential Equation (SDE)</h6>
						<p className="text-zinc-400">
							A generic asset price <InlineMath math="S_t" /> model under rough stochastic
							volatility <InlineMath math="\sigma_t" /> is:
						</p>
						<BlockMath math="dS_t = \mu S_t dt + \sigma_t S_t dW_t" />
						<p className="text-zinc-400">
							where <InlineMath math="\sigma_t" /> is driven by a correlated fractional process.
						</p>
					</div>
					<div>
						<h6 className="font-semibold text-zinc-300">Fractional Brownian Motion (fBM)</h6>
						<p className="text-zinc-400">
							fBM, <InlineMath math="B_H(t)" />, can be represented by the Riemann-Liouville
							fractional integral:
						</p>
						<BlockMath
							math={'\\begin{aligned}B_H(t) = \\frac{1}{\\Gamma(H + 1/2)} \\int_0^t (t-s)^{H - 1/2} dW_s\\end{aligned}'}
						/>
						<p className="text-zinc-400">
							This formulation builds memory into the process, generating the rough and trending
							paths observed in empirical data.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
