import { useState, useEffect, useRef } from 'react';

const commands = {
	help: `
        <p class="mb-1">Available commands:</p>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">help</span><span>Shows this help message.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">projects</span><span>Lists featured projects.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">links</span><span>Displays contact and social links.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">cv</span><span>Shows current position.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">clear</span><span>Clears the terminal.</span></div>
    `,
	projects: [
		'First Rust API (Stock VaR)',
		'Rough Volatility Monte Carlo Pricer',
		'Nitor Energy Forecasting Competition 2026',
		'Lifepack (R Package)',
	]
		.map((p) => `<div>- ${p}</div>`)
		.join(''),
	links: `
        <div class="flex"><span class="w-16 shrink-0 text-zinc-500">GITHUB</span><a href="https://github.com/OskarAllerslev" target="_blank" rel="noopener noreferrer" class="text-accent-hover hover:underline">github.com/OskarAllerslev</a></div>
        <div class="flex"><span class="w-16 shrink-0 text-zinc-500">EMAIL</span><a href="mailto:Oskar.m1660@gmail.com" class="text-accent-hover hover:underline">Oskar.m1660@gmail.com</a></div>
    `,
	cv: `<p>Student Actuary at PFA Pension (DevOps & Data Eng). MSc Actuarial Math at UCPH.</p>`,
};

const Prompt = ({ command }) => (
	<div className="flex">
		<div>
			<span className="text-terminal-green">oskar@oskarallerslev.dev</span>
			<span className="text-zinc-500">:</span>
			<span className="text-blue-400">~</span>
			<span className="text-zinc-500">$</span>
		</div>
		<div className="ml-2 flex-1">{command}</div>
	</div>
);

export default function TerminalSession() {
	const [history, setHistory] = useState([]);
	const [input, setInput] = useState('');
	const endOfTerminalRef = useRef(null);
	const inputRef = useRef(null);

	const executeCommand = (command) => {
		const lowerCmd = command.toLowerCase().trim();
		let output = '';

		if (lowerCmd === 'clear') {
			setHistory([]);
			return;
		}

		if (lowerCmd === 'help') {
			output = commands.help;
		} else if (lowerCmd === 'projects' || lowerCmd === 'ls') {
			output = commands.projects;
		} else if (lowerCmd === 'links' || lowerCmd === './contact.sh') {
			output = commands.links;
		} else if (lowerCmd === 'cv') {
			output = commands.cv;
		} else if (lowerCmd !== '') {
			output = `<p>command not found: ${command}. Try 'help'.</p>`;
		}

		const newHistoryEntry = { command, output };
		setHistory((prevHistory) => [...prevHistory, newHistoryEntry]);
	};

	useEffect(() => {
		executeCommand('links');
	}, []);

	useEffect(() => {
		endOfTerminalRef.current?.scrollIntoView();
	}, [history]);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			executeCommand(input);
			setInput('');
		}
	};

	return (
		<div
			id="terminal"
			className="rounded-lg border border-zinc-800 bg-black p-4 font-mono text-sm text-zinc-300"
			onClick={() => inputRef.current?.focus()}
		>
			<div id="terminal-output" className="mb-2">
				{history.map((entry, index) => (
					<div key={index} className="mb-2">
						<Prompt command={entry.command} />
						<div dangerouslySetInnerHTML={{ __html: entry.output }} />
					</div>
				))}
				<div ref={endOfTerminalRef} />
			</div>
			<div className="flex items-center">
				<span className="text-terminal-green">oskar@oskarallerslev.dev</span>
				<span className="text-zinc-500">:</span>
				<span className="text-blue-400">~</span>
				<span className="text-zinc-500">$</span>
				<input
					ref={inputRef}
					type="text"
					id="terminal-input"
					className="ml-2 flex-1 bg-transparent"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus
				/>
			</div>
		</div>
	);
}
