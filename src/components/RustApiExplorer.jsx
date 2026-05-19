import React, { useState } from 'react';

const API_BASE_URL = 'https://oskar-rust-api.onrender.com';

const endpoints = {
	is_alive: { path: '/is_alive', params: [] },
	data: { path: '/data/{ticker}', params: ['ticker'] },
	ema: { path: '/ema/{ticker}', params: ['ticker', 'window_size'] },
	var: { path: '/var/{ticker}', params: ['ticker', 'alpha', 'interval', 'range'] },
};

const defaultParams = {
	ticker: 'AAPL',
	window_size: '20',
	alpha: '0.95',
	interval: '1d',
	range: '1y',
};

const paramPlaceholders = {
	ticker: 'e.g., AAPL',
	window_size: 'e.g., 20',
	alpha: 'e.g., 0.95',
	interval: 'e.g., 1d',
	range: 'e.g., 1y',
};

const OutputDisplay = ({ data, error }) => {
	if (error) {
		return (
			<pre className="mt-4 w-full overflow-x-auto rounded-md bg-red-950/50 p-3 text-sm text-red-300 border border-red-500/20">
				<code>{error}</code>
			</pre>
		);
	}
	if (data) {
		return (
			<pre className="mt-4 w-full overflow-x-auto rounded-md bg-zinc-950 p-3 text-sm text-terminal-green border border-zinc-800">
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		);
	}
	return null;
};

export default function RustApiExplorer() {
	const [selectedEndpoint, setSelectedEndpoint] = useState('is_alive');
	const [params, setParams] = useState(defaultParams);
	const [isLoading, setIsLoading] = useState(false);
	const [output, setOutput] = useState(null);
	const [error, setError] = useState(null);
	const [log, setLog] = useState([]);

	const handleParamChange = (e) => {
		const { name, value } = e.target;
		setParams((prev) => ({ ...prev, [name]: value }));
	};

	const handleSendRequest = async () => {
		setIsLoading(true);
		setOutput(null);
		setError(null);
		setLog([{ time: new Date(), msg: '[INFO] Waking up Render server... (Cold starts take 30-50s)' }]);

		const endpointInfo = endpoints[selectedEndpoint];
		let url = endpointInfo.path;

		endpointInfo.params.forEach((param) => {
			url = url.replace(`{${param}}`, params[param]);
		});

		// Handle query params for ema and var
		if (selectedEndpoint === 'ema') {
			url += `?window_size=${params.window_size}`;
		} else if (selectedEndpoint === 'var') {
			url += `?alpha=${params.alpha}&interval=${params.interval}&range=${params.range}`;
		}

		const fullUrl = `${API_BASE_URL}${url}`;

		try {
			const res = await fetch(fullUrl);
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || `HTTP error! status: ${res.status}`);
			}
			setOutput(data);
			setLog((prev) => [...prev, { time: new Date(), msg: `[INFO] Request successful (${res.status})` }]);
		} catch (err) {
			const errorMessage = '[ERROR] Network error. The Render server might be waking up, or CORS is failing.';
			setError(errorMessage);
			setLog((prev) => [...prev, { time: new Date(), msg: errorMessage }]);
		} finally {
			setIsLoading(false);
		}
	};

	const currentParams = endpoints[selectedEndpoint].params;

	return (
		<div className="mt-4 font-mono">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="flex-1">
					<label htmlFor="endpoint-select" className="text-sm font-semibold text-zinc-400">
						Endpoint
					</label>
					<select
						id="endpoint-select"
						value={selectedEndpoint}
						onChange={(e) => setSelectedEndpoint(e.target.value)}
						className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-terminal-green focus:ring-terminal-green"
					>
						{Object.keys(endpoints).map((key) => (
							<option key={key} value={key}>
								{endpoints[key].path}
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
					{currentParams.map((param) => (
						<div key={param}>
							<label htmlFor={param} className="block text-xs font-semibold uppercase text-zinc-500">
								{param}
							</label>
							<input
								type="text"
								name={param}
								id={param}
								value={params[param]}
								onChange={handleParamChange}
								placeholder={paramPlaceholders[param]}
								className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-terminal-green focus:ring-terminal-green"
							/>
						</div>
					))}
				</div>
			)}

			{(isLoading || output || error) && (
				<div className="mt-4 border-t border-zinc-800 pt-4">
					<h5 className="text-sm font-semibold text-zinc-400">Response</h5>
					{log.length > 0 && (
						<div className="mt-2 text-xs text-terminal-green/80">
							{log.map((l) => (
								<div key={l.time.toISOString()}>{l.msg}</div>
							))}
						</div>
					)}
					<OutputDisplay data={output} error={error} />
				</div>
			)}
		</div>
	);
}
