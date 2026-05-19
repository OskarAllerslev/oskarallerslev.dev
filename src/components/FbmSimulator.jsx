import React, { useState, useEffect } from 'react';
import pkg from 'react-katex';
const { BlockMath, InlineMath } = pkg;

// Path generation logic
const generateFbmPath = (H, length) => {
	const path = new Array(length).fill(0);
	const mean = 0;

	for (let i = 1; i < length; i++) {
		const noise = Math.random() - 0.5;
		let step;

		if (H < 0.5) {
			// Mean-reverting
			const reversion_strength = 1 - 2 * H; // Stronger as H -> 0
			step = -reversion_strength * (path[i - 1] - mean) + noise;
		} else if (H > 0.5) {
			// Trending / Momentum
			const trend_strength = 2 * H - 1; // Stronger as H -> 1
			const momentum = i > 1 ? path[i - 1] - path[i - 2] : 0;
			step = trend_strength * momentum + noise;
		} else {
			// Standard Brownian motion
			step = noise;
		}
		path[i] = path[i - 1] + step;
	}
	return path;
};

export default function FbmSimulator() {
	const [H, setH] = useState(0.2);
	const [pathKey, setPathKey] = useState(0); // To force regeneration
	const [pathData, setPathData] = useState('');

	const width = 600;
	const height = 300;
	const points = 200;
	const padding = { top: 20, right: 20, bottom: 40, left: 50 };
	const plotWidth = width - padding.left - padding.right;
	const plotHeight = height - padding.top - padding.bottom;

	useEffect(() => {
		const rawPath = generateFbmPath(H, points);

		const yMin = Math.min(...rawPath);
		const yMax = Math.max(...rawPath);
		const yRange = yMax - yMin || 1;

		const mappedPath = rawPath
			.map((y, i) => {
				const x = padding.left + (i / (points - 1)) * plotWidth;
				const scaledY = ((y - yMin) / yRange) * plotHeight;
				const invertedY = padding.top + plotHeight - scaledY; // SVG Y-coords are top-down
				return `${x},${invertedY}`;
			})
			.join(' ');

		setPathData(mappedPath);
	}, [H, pathKey]);

	return (
		<div className="mt-4">
			<div className="border-b border-zinc-800 pb-4">
				<svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded-lg bg-zinc-950 border border-zinc-800">
					{/* Axes */}
					<line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#404040" strokeWidth="1" />
					<line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#404040" strokeWidth="1" />

					{/* Axis Labels */}
					<text x={padding.left - 30} y={padding.top + plotHeight / 2} fill="#a1a1aa" fontSize="12" transform={`rotate(-90 ${padding.left - 30},${padding.top + plotHeight / 2})`}>
						B_H(t)
					</text>
					<text x={padding.left + plotWidth / 2} y={height - 10} fill="#a1a1aa" fontSize="12">
						t
					</text>

					{/* Path */}
					<polyline points={pathData} fill="none" stroke="#06b6d4" strokeWidth="1.5" style={{ filter: 'drop-shadow(0px 0px 5px #06b6d4)' }} />
				</svg>
				<div className="mt-2 rounded-md border border-amber-600/30 bg-amber-950/20 p-2 text-center text-xs text-amber-400">
					<span className="font-bold">[PROXY MODE]</span> This is a client-side JavaScript
					visualization. The actual high-performance Monte Carlo SDE engine runs in C++.
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="flex-1">
					<label htmlFor="hurst-slider" className="block text-sm font-medium text-zinc-300">
						Hurst Parameter (H): {H.toFixed(2)}
					</label>
					<input
						id="hurst-slider"
						type="range"
						min="0.05"
						max="0.95"
						step="0.01"
						value={H}
						onChange={(e) => setH(parseFloat(e.target.value))}
						className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-teal-500"
					/>
				</div>
				<button onClick={() => setPathKey((k) => k + 1)} className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700">
					Regenerate Path
				</button>
			</div>

			<div className="mt-6 border-t border-zinc-800 pt-4">
				<h5 className="text-base font-semibold text-zinc-100">Rough Volatility Model</h5>
				<div className="mt-4 space-y-4 text-sm text-zinc-400">
					<div>
						<p>Asset price dynamics under a rough stochastic volatility model (like Rough Bergomi) follow:</p>
						<BlockMath math="dS_t = S_t \\sqrt{V_t} dW_t" />
						<p>The variance process <InlineMath math="V_t" /> is driven by a fractional Brownian motion:</p>
						<BlockMath math={'V_t = V_0 \\exp\\left( \\eta B_H(t) - \\frac{1}{2} \\eta^2 t^{2H} \\right)'} />
						<p className="mt-2">
							The variance process is driven by a fractional Brownian motion <InlineMath math="B_H(t)" /> with <InlineMath math="H < 0.5" />, capturing the rough
							volatility empirically observed in energy markets. Simulation requires exact Cholesky decomposition of the auto-covariance matrix.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
