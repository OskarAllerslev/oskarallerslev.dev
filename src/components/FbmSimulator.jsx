import React from 'react';
import pkg from 'react-katex';
const { BlockMath, InlineMath } = pkg;

export default function FbmSimulator() {
	return (
		<div className="mt-4 space-y-4 font-mono text-zinc-400">
			{/* Research Note Header */}
			<div className="text-xs uppercase tracking-wider text-zinc-550 border-b border-zinc-800 pb-1">
				Quantitative Research Note
			</div>
			
			<details className="group border border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden transition-all duration-300">
				<summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900/30 transition-colors select-none text-xs font-semibold uppercase tracking-wider text-zinc-350">
					<span>Click to expand mathematical proof</span>
					<svg
						className="h-4 w-4 text-zinc-550 transition-transform duration-300 group-open:rotate-180"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</summary>
				
				<div className="p-5 border-t border-zinc-850 space-y-6">
					<div>
						<h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
							Rough Heston Asset SDE
						</h5>
						<div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 flex justify-center text-zinc-100 overflow-x-auto no-scrollbar">
							<BlockMath math={"dS_t = \\mu S_t dt + \\sqrt{V_t} S_t dW_t^1"} />
						</div>
					</div>

					<div>
						<h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
							Variance Process (Rough Volatility)
						</h5>
						<div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 flex justify-center text-zinc-100 overflow-x-auto no-scrollbar">
							<BlockMath math={"V_t = V_0 \\exp\\left( \\eta B_H(t) - \\frac{1}{2} \\eta^2 t^{2H} \\right)"} />
						</div>
					</div>

					<div className="space-y-2 border-t border-zinc-850 pt-4">
						<h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
							Cholesky Covariance Decomposition
						</h5>
						<p className="text-xs text-zinc-450 leading-relaxed font-sans">
							Simulating the fractional Brownian motion <InlineMath math={"B_H(t)"} /> for <InlineMath math={"H < 0.5"} /> requires careful consideration of its auto-covariance structure. The C++ engine performs an exact Cholesky decomposition of the dense covariance matrix <InlineMath math={"\\Sigma = LL^T"} /> to generate valid rough volatility paths, ensuring statistical integrity.
						</p>
					</div>
				</div>
			</details>
		</div>
	);
}
