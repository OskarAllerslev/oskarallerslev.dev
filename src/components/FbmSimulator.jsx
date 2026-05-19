import React, { useState, useEffect, useMemo } from 'react';
import pkg from 'react-katex';
const { BlockMath, InlineMath } = pkg;

const generatePath = (H, length) => {
	const path = new Array(length).fill(0);
	for (let i = 1; i < length; i++) {
		const noise = Math.random() - 0.5;
		let step;
		if (H < 0.5) {
			const reversion = 1 - 2 * H;
			step = -reversion * path[i - 1] + noise;
		} else if (H > 0.5) {
			const trend = 2 * H - 1;
			const momentum = i > 1 ? path[i - 1] - path[i - 2] : 0;
			step = trend * momentum + noise;
		} else {
			step = noise;
		}
		path[i] = path[i - 1] + step;
	}
	return path;
};

export default function FbmSimulator() {
	const [H, setH] = useState(0.2);
	const [pathKey, setPathKey] = useState(0);

	const width = 600;
	const height = 300;
	const points = 200;
	const padding = 20;

	const pathData = useMemo(() => {
		const rawPath = generatePath(H, points);
		const yMin = Math.min(...rawPath);
		const yMax = Math.max(...rawPath);
		const yRange = yMax - yMin || 1;

		return rawPath
			.map((val, i) => {
				const x = padding + (i / (points - 1)) * (width - padding * 2);
				const y = height - padding - ((val - yMin) / yRange) * (height - padding * 2);
				return `${x},${y}`;
			})
			.join(' ');
	}, [H, pathKey]);

	return (
		<div className="mt-4">
			<div className="border-b border-zinc-800 pb-4">
				<svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded-lg bg-zinc-950 border border-zinc-800">
					{/* Axes */}
					<line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#3f3f46" strokeWidth="1" />
					<line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#3f3f46" strokeWidth="1" />

					{/* Path */}
					<polyline
						points={pathData}
						fill="none"
						stroke="#06b6d4"
						strokeWidth="2"
						style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }}
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
