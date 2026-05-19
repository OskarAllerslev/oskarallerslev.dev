import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://oskar-rust-api.onrender.com';

const endpointsConfig = {
	data: { path: '/data/', params: ['ticker', 'interval', 'range'] },
	ema: { path: '/ema/', params: ['ticker', 'interval', 'range', 'smoothing'] },
	var: { path: '/var/', params: ['ticker', 'interval', 'range', 'alpha'] },
};

const paramInputs = {
	ticker: { label: 'Ticker', type: 'text' },
	interval: { label: 'Interval', type: 'text' },
	range: { label: 'Range', type: 'text' },
	smoothing: { label: 'Smoothing Constant', type: 'number', step: '0.01' },
	alpha: { label: 'Alpha (VaR Quantile)', type: 'number', step: '0.005' },
};

const DataChart = ({ data }) => {
	const width = 500;
	const height = 250;
	const padding = { top: 20, right: 20, bottom: 20, left: 50 };

	if (!data || !Array.isArray(data) || data.length === 0 || typeof data[0].close !== 'number') return null;

	const prices = data.map((d) => d.close);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	const priceRange = maxPrice - minPrice || 1;

	const points = prices
		.map((price, i) => {
			const x = padding.left + (i / (prices.length - 1)) * (width - padding.left - padding.right);
			const y =
				height -
				padding.bottom -
				((price - minPrice) / priceRange) * (height - padding.top - padding.bottom);
			return `${x},${y}`;
		})
		.join(' ');

	return (
		<svg
			width="100%"
			viewBox={`0 0 ${width} ${height}`}
			className="mt-2 rounded-lg bg-zinc-950 border border-zinc-800"
		>
			{/* Axes */}
			<line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#52525b" strokeWidth="1" />
			<line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#52525b" strokeWidth="1" />

			{/* Y-Axis Labels */}
			<text x={padding.left - 8} y={padding.top + 4} textAnchor="end" fill="#a1a1aa" fontSize="10">
				{maxPrice.toFixed(2)}
			</text>
			<text x={padding.left - 8} y={height - padding.bottom} textAnchor="end" fill="#a1a1aa" fontSize="10">
				{minPrice.toFixed(2)}
			</text>

			<polyline
				fill="none"
				stroke="#06b6d4"
				strokeWidth="1.5"
				points={points}
				style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }}
			/>
		</svg>
	);
};

export default function RustApiExplorer() {
	const [endpoint, setEndpoint] = useState('data');
	const [params, setParams] = useState({
		ticker: 'AAPL',
		interval: '1d',
		range: '1y',
		smoothing: 0.2,
		alpha: 0.99,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [output, setOutput] = useState(null);
	const [error, setError] = useState(null);
	const [log, setLog] = useState([]);
	const [urlToCall, setUrlToCall] = useState('');

	useEffect(() => {
		const config = endpointsConfig[endpoint];
		let url = `${API_BASE_URL}${config.path}`;
		const queryParams = new URLSearchParams();

		if (config.params.includes('ticker')) {
			url += params.ticker;
		}
		if (config.params.includes('interval')) queryParams.append('interval', params.interval);
		if (config.params.includes('range')) queryParams.append('range', params.range);
		if (config.params.includes('smoothing'))
			queryParams.append('smoothing_constant', params.smoothing);
		if (config.params.includes('alpha')) queryParams.append('alpha', params.alpha);

		const queryString = queryParams.toString();
		if (queryString) url += `?${queryString}`;
		setUrlToCall(url);
	}, [endpoint, params]);

	const handleParamChange = (e) => {
		const { name, value, type } = e.target;
		setParams((prev) => ({
			...prev,
			[name]: type === 'number' ? parseFloat(value) : value,
		}));
	};

	const handleSendRequest = async () => {
		setIsLoading(true);
		setOutput(null);
		setError(null);
		setLog([`[INFO] Calling ${urlToCall}...`]);

		try {
			const res = await fetch(urlToCall, { mode: 'cors' });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || `HTTP error! status: ${res.status}`);
			setOutput(data);
			setLog((prev) => [...prev, `[INFO] Request successful (${res.status})`]);
		} catch (err) {
			const errorMessage = `[ERROR] Network error. The Render server might be waking up, or CORS is failing. (${err.message})`;
			setError(errorMessage);
			setLog((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const currentParams = endpointsConfig[endpoint].params;

	return (
		<div className="mt-4 font-mono">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="flex-1">
					<label htmlFor="endpoint-select" className="text-sm font-semibold text-zinc-400">
						Endpoint
					</label>
					<select
						id="endpoint-select"
						value={endpoint}
						onChange={(e) => setEndpoint(e.target.value)}
						className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-terminal-green focus:ring-terminal-green"
					>
						{Object.keys(endpointsConfig).map((key) => (
							<option key={key} value={key}>
								{endpointsConfig[key].path}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={handleSendRequest}
					disabled={isLoading}
					className="self-end rounded-md bg-terminal-green px-6 py-2 text-sm font-bold text-zinc-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-zinc-700"
				>
					{isLoading ? 'Sending...' : 'Send Request'}
				</button>
			</div>

			{currentParams.length > 0 && (
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{currentParams.map((param) => {
						const inputConfig = paramInputs[param];
						return (
							<div key={param}>
								<label
									htmlFor={param}
									className="block text-xs font-semibold uppercase text-zinc-500"
								>
									{inputConfig.label}
								</label>
								<input
									type={inputConfig.type}
									name={param}
									id={param}
									value={params[param]}
									onChange={handleParamChange}
									step={inputConfig.step || null}
									className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-terminal-green focus:ring-terminal-green"
								/>
							</div>
						);
					})}
				</div>
			)}

			<div className="mt-4 border-t border-zinc-800 pt-4">
				<h5 className="text-sm font-semibold text-zinc-400">Request URL</h5>
				<pre className="mt-2 w-full overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-400 border border-zinc-800">
					<code>{urlToCall}</code>
				</pre>
			</div>

			{(isLoading || output || error) && (
				<div className="mt-4">
					<h5 className="text-sm font-semibold text-zinc-400">Response</h5>
					<div className="mt-2 text-xs text-terminal-green/80">
						{log.map((l, i) => (
							<div key={i}>{l}</div>
						))}
					</div>
					{error && (
						<pre className="mt-2 w-full overflow-x-auto rounded-md bg-red-950/50 p-3 text-sm text-red-300 border border-red-500/20">
							<code>{error}</code>
						</pre>
					)}
					{output && endpoint === 'data' && <DataChart data={output} />}
					{output && (endpoint === 'ema' || endpoint === 'var') && (
						<pre className="mt-2 w-full overflow-x-auto rounded-md bg-zinc-950 p-3 text-sm text-terminal-green border border-zinc-800">
							<code>{JSON.stringify(output, null, 2)}</code>
						</pre>
					)}
				</div>
			)}
		</div>
	);
}
