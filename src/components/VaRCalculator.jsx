import { useState } from 'react';

export default function VaRCalculator() {
	const [ticker, setTicker] = useState('AAPL');
	const [alpha, setAlpha] = useState('0.95');
	const [isLoading, setIsLoading] = useState(false);
	const [output, setOutput] = useState([{ type: 'info', text: '[INFO] Ready for calculation.' }]);

	const handleCalculate = async () => {
		setIsLoading(true);
		setOutput([
			{ type: 'pulse', text: '[INFO] Waking up Rust server... (Cold start can take 30-50s)' },
		]);

		const timeoutId = setTimeout(() => {
			setOutput((prev) => {
				if (prev.length === 1 && prev[0].text.includes('Waking up')) {
					return [...prev, { type: 'pulse', text: '[INFO] Running calculation...' }];
				}
				return prev;
			});
		}, 2500);

		try {
			const response = await fetch(
				`https://oskar-rust-api.onrender.com/var/${ticker}?interval=1d&range=1y&alpha=${alpha}`
			);
			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || `HTTP error! status: ${response.status}`);
			}

			const varResult = await response.text();
			setOutput([
				{ type: 'success', text: '[SUCCESS] Calculation complete.' },
				{ type: 'result', text: `> Ticker: ${ticker}` },
				{ type: 'result', text: `> Confidence: ${alpha === '0.95' ? '95%' : '99%'}` },
				{ type: 'result', text: `> 1-day VaR: ${parseFloat(varResult).toFixed(4)}` },
			]);
		} catch (error) {
			clearTimeout(timeoutId);
			setOutput([{ type: 'error', text: `[ERROR] Calculation failed: ${error.message}` }]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mt-4 space-y-4 font-mono text-sm">
			<div className="flex items-center gap-4">
				<label htmlFor="ticker-input" className="text-zinc-400">
					Ticker:
				</label>
				<input
					type="text"
					id="ticker-input"
					value={ticker}
					onChange={(e) => setTicker(e.target.value.toUpperCase())}
					className="w-24 rounded border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100 focus:border-accent focus:ring-accent"
					disabled={isLoading}
				/>
			</div>
			<div className="flex items-center gap-4">
				<label htmlFor="alpha-select" className="text-zinc-400">
					Confidence:
				</label>
				<select
					id="alpha-select"
					value={alpha}
					onChange={(e) => setAlpha(e.target.value)}
					className="w-24 rounded border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100 focus:border-accent focus:ring-accent"
					disabled={isLoading}
				>
					<option value="0.95">95%</option>
					<option value="0.99">99%</option>
				</select>
			</div>
			<button
				onClick={handleCalculate}
				disabled={isLoading}
				className="w-full rounded bg-zinc-800 px-3 py-2 text-zinc-300 transition-colors hover:bg-accent hover:text-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700"
			>
				{isLoading ? 'Calculating...' : 'Calculate VaR'}
			</button>
			<div className="mt-4 min-h-[88px] rounded bg-black p-2 text-xs text-zinc-300">
				{output.map((line, index) => {
					let lineClass = '';
					switch (line.type) {
						case 'info':
							lineClass = 'text-zinc-500';
							break;
						case 'pulse':
							lineClass = 'animate-pulse';
							break;
						case 'success':
							lineClass = 'text-terminal-green';
							break;
						case 'error':
							lineClass = 'text-red-500';
							break;
						default:
							break;
					}
					return (
						<p key={index} className={lineClass}>
							{line.text}
						</p>
					);
				})}
			</div>
		</div>
	);
}
