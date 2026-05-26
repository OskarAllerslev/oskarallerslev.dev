import { useState } from 'react';

// A simple loading spinner component
const Spinner = ({ className }) => (
	<svg
		className={`h-5 w-5 animate-spin ${className}`}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		></circle>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
);

export default function VaRCalculator() {
	const [ticker, setTicker] = useState('AAPL');
	const [alpha, setAlpha] = useState('0.95');
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState(null);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const handleCalculate = async () => {
		setIsLoading(true);
		setStatus('Waking up Rust server... (Cold start can take 30-50s)');
		setResult(null);
		setError(null);

		const timeoutId = setTimeout(() => {
			setStatus('Running calculation...');
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
			setResult({
				value: parseFloat(varResult).toFixed(4),
				ticker,
				alpha,
			});
			setStatus(null);
		} catch (error) {
			setError(`Calculation failed: ${error.message}`);
			setStatus(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<label htmlFor="ticker-input" className="block text-xs font-medium text-zinc-400">
						Ticker
					</label>
					<input
						type="text"
						id="ticker-input"
						value={ticker}
						onChange={(e) => setTicker(e.target.value.toUpperCase())}
						className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
						disabled={isLoading}
					/>
				</div>
				<div>
					<label htmlFor="alpha-select" className="block text-xs font-medium text-zinc-400">
						Confidence
					</label>
					<select
						id="alpha-select"
						value={alpha}
						onChange={(e) => setAlpha(e.target.value)}
						className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 py-2 pl-3 pr-10 text-sm text-zinc-100 focus:border-teal-500 focus:ring-teal-500"
						disabled={isLoading}
					>
						<option value="0.95">95%</option>
						<option value="0.99">99%</option>
					</select>
				</div>
				<div className="sm:pt-[1.125rem]">
					<button
						onClick={handleCalculate}
						disabled={isLoading}
						className="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700"
					>
						{isLoading ? <Spinner className="text-white" /> : 'Calculate VaR'}
					</button>
				</div>
			</div>

			<div className="mt-4 flex min-h-[96px] items-center justify-center rounded-lg bg-zinc-950 p-4 text-center">
				{isLoading && (
					<div>
						<Spinner className="mx-auto text-zinc-400" />
						<p className="mt-2 text-sm text-zinc-400">{status}</p>
					</div>
				)}
				{error && <p className="text-sm text-red-500">{error}</p>}
				{result && !isLoading && (
					<div>
						<p className="text-sm text-zinc-400">
							1-Day VaR for {result.ticker} at {result.alpha === '0.95' ? '95%' : '99%'} Confidence
						</p>
						<p className="mt-1 text-4xl font-bold tracking-tight text-teal-400">{result.value}</p>
					</div>
				)}
				{!isLoading && !error && !result && (
					<p className="text-sm text-zinc-500">Enter a ticker and click Calculate.</p>
				)}
			</div>
		</div>
	);
}
