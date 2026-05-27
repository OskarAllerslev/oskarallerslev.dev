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
	const height = 240;
	const padding = { top: 15, right: 15, bottom: 35, left: 45 };
	const plotWidth = width - padding.left - padding.right;
	const plotHeight = height - padding.top - padding.bottom;

	if (!data || !Array.isArray(data) || data.length === 0 || typeof data[0].close !== 'number') return null;

	const prices = data.map((d) => d.close);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	const priceRange = maxPrice - minPrice || 1;

	// Y-axis ticks (5 grid lines)
	const yTicks = 4;
	const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minPrice + (priceRange / yTicks) * i);
	const yTickPositions = yTickValues.map(val => height - padding.bottom - ((val - minPrice) / priceRange) * plotHeight);

	// X-axis ticks (5 grid lines)
	const xTicks = 4;
	const xTickIndices = Array.from({ length: xTicks + 1 }, (_, i) => Math.floor((i / xTicks) * (prices.length - 1)));
	const xTickPositions = xTickIndices.map(i => padding.left + (i / (prices.length - 1)) * plotWidth);
	
	const points = prices.map((price, i) => {
			const x = padding.left + (i / (prices.length - 1)) * plotWidth;
			const y = height - padding.bottom - ((price - minPrice) / priceRange) * plotHeight;
			return `${x},${y}`;
		}).join(' ');

	return (
		<svg width="100%" viewBox={`0 0 ${width} ${height}`} className="mt-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono">
			{/* Axes Lines */}
			<line
				x1={padding.left}
				y1={padding.top}
				x2={padding.left}
				y2={height - padding.bottom}
				stroke="#27272a"
				strokeWidth="1"
			/>
			<line
				x1={padding.left}
				y1={height - padding.bottom}
				x2={width - padding.right}
				y2={height - padding.bottom}
				stroke="#27272a"
				strokeWidth="1"
			/>

			{/* Horizontal Gridlines & Y-axis Labels & Tick Markers */}
			{yTickPositions.map((y, i) => (
				<g key={`y-grid-${i}`}>
					<line
						x1={padding.left}
						y1={y}
						x2={width - padding.right}
						y2={y}
						stroke="#27272a"
						strokeWidth="1"
						strokeDasharray="3 3"
					/>
					<line
						x1={padding.left - 4}
						y1={y}
						x2={padding.left}
						y2={y}
						stroke="#27272a"
						strokeWidth="1"
					/>
					<text x="5" y={y + 3} className="text-[9px] fill-zinc-400 font-mono">
						{yTickValues[i].toFixed(2)}
					</text>
				</g>
			))}

			{/* Vertical Gridlines & X-axis Labels & Tick Markers */}
			{xTickPositions.map((x, i) => {
				const xLabel = (i / xTicks).toFixed(2);
				const dateLabel = new Date(data[xTickIndices[i]].date).toLocaleDateString('en-CA', {
					month: 'short',
					day: 'numeric',
				});
				return (
					<g key={`x-grid-${i}`}>
						<line
							x1={x}
							y1={padding.top}
							x2={x}
							y2={height - padding.bottom}
							stroke="#27272a"
							strokeWidth="1"
							strokeDasharray="3 3"
						/>
						<line
							x1={x}
							y1={height - padding.bottom}
							x2={x}
							y2={height - padding.bottom + 4}
							stroke="#27272a"
							strokeWidth="1"
						/>
						<text x={x} y={height - padding.bottom + 14} textAnchor="middle" className="text-[9px] fill-zinc-400 font-mono">
							{xLabel}
						</text>
						<text x={x} y={height - padding.bottom + 24} textAnchor="middle" className="text-[8px] fill-zinc-550 font-mono">
							{dateLabel}
						</text>
					</g>
				);
			})}

			<polyline fill="none" stroke="#14b8a6" strokeWidth="1.5" points={points} style={{ filter: 'drop-shadow(0 0 6px rgba(20,184,166,0.25))' }} />
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
		setLog([`[INFO] Querying ${urlToCall}...`]);

		try {
			const res = await fetch(urlToCall, { mode: 'cors' });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || `HTTP error! status: ${res.status}`);
			setOutput(data);
			setLog((prev) => [...prev, `[SUCCESS] Fetch complete (${res.status})`]);
		} catch (err) {
			const errorMessage = `[ERROR] Failed to query endpoint: ${err.message}`;
			setError(errorMessage);
			setLog((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const currentParams = endpointsConfig[endpoint].params;

	return (
		<div className="mt-4 space-y-4 font-mono text-zinc-400">
			{/* Control Panel Header */}
			<div className="text-xs uppercase tracking-wider text-zinc-550 border-b border-zinc-800 pb-1">
				Query Control Panel
			</div>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
				<div className="flex-1">
					<label htmlFor="endpoint-select" className="text-xs font-semibold text-zinc-500 uppercase">
						Target Endpoint
					</label>
					<select
						id="endpoint-select"
						value={endpoint}
						onChange={(e) => setEndpoint(e.target.value)}
						className="mt-1 block w-full rounded-lg border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
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
					className="rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-650 h-[38px] flex items-center justify-center"
				>
					{isLoading ? 'Sending...' : 'Send Request'}
				</button>
			</div>

			{currentParams.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{currentParams.map((param) => {
						const inputConfig = paramInputs[param];
						return (
							<div key={param}>
								<label
									htmlFor={param}
									className="block text-[10px] font-semibold uppercase text-zinc-500"
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
									className="mt-1 block w-full rounded-lg border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
								/>
							</div>
						);
					})}
				</div>
			)}

			<div className="space-y-1">
				<h5 className="text-[10px] font-semibold text-zinc-500 uppercase">Target URI</h5>
				<pre className="w-full overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-400 border border-zinc-800">
					<code>{urlToCall}</code>
				</pre>
			</div>

			{(isLoading || output || error) && (
				<div className="space-y-2">
					<h5 className="text-[10px] font-semibold text-zinc-500 uppercase">Console Log</h5>
					<div className="text-[11px] font-mono space-y-1 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
						{log.map((l, i) => {
							const colorClass = l.includes('[ERROR]')
								? 'text-red-400'
								: l.includes('[SUCCESS]')
								? 'text-teal-400'
								: 'text-zinc-400';
							return (
								<div key={i} className={colorClass}>
									{l}
								</div>
							);
						})}
					</div>
					{error && (
						<pre className="w-full overflow-x-auto rounded-lg bg-red-950/20 p-3 text-xs text-red-400 border border-red-900/30">
							<code>{error}</code>
						</pre>
					)}
					{output && endpoint === 'data' && <DataChart data={output} />}
					{output && (endpoint === 'ema' || endpoint === 'var') && (
						<pre className="w-full overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-teal-400 border border-zinc-800">
							<code>{JSON.stringify(output, null, 2)}</code>
						</pre>
					)}
				</div>
			)}
		</div>
	);
}
