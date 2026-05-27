import { useState, useEffect, useRef } from 'react';

const commands = {
	help: `Available commands:
- experience : Display professional work history.
- education  : Show academic background.
- skills     : List technical stack.
- clear      : Reset terminal.`,
	experience: `[ Nov 2024 - Present ] PFA Pension | Student Actuary
- Designed Azure DevOps ETL pipelines for Commercial Insurance.
- Automated client reporting via R officer package.
- Built interactive Shiny dashboards.
- Executed complex data transformations using SQL and dplyr/dbplyr.

[ Jan 2024 - Jan 2025 ] Again Bio | Finance Assistant
- Constructed financial models and budget forecasts using renewal theory.`,
	education: `[ Sep 2024 - Present ] MSc Actuarial Mathematics @ University of Copenhagen
- Focus: Advanced probability, QRM, ML, financial econometrics.

[ Sep 2021 - Jun 2024 ] BSc Actuarial Mathematics @ University of Copenhagen
- Thesis: Hybrid insurance pricing framework.
- Highlight: Engineered a fire claim severity model using Extreme Value Theory (EVT).`,
	skills: `Languages: R (Advanced/Package Dev), SQL, Python, C++, LaTeX.
Tools: Git, Azure DevOps, VS Code, Shiny, Tidyverse.
Math: Extreme Value Theory, GLM, Time Series (Cointegration), Machine Learning.`,
};

const Prompt = ({ children }) => (
	<div className="flex text-[13px] leading-relaxed">
		<div className="flex-shrink-0">
			<span className="text-terminal-green">oskar@oskarallerslev.dev</span>
			<span className="text-zinc-500">:</span>
			<span className="text-blue-400">~</span>
			<span className="text-zinc-500">$</span>
		</div>
		<div className="ml-2 flex-1">{children}</div>
	</div>
);

export default function TerminalSession() {
	const [history, setHistory] = useState([
		{
			command: '',
			output: "Welcome to Oskar's interactive portfolio. Type \"help\" to explore my CV.",
		},
	]);
	const [input, setInput] = useState('');
	const terminalBodyRef = useRef(null);

	useEffect(() => {
		if (terminalBodyRef.current) {
			terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
		}
	}, [history]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const lowerCmd = input.toLowerCase().trim();
		let output = '';

		if (lowerCmd === 'clear') {
			setHistory([]);
			setInput('');
			return;
		}

		if (lowerCmd === 'help') {
			output = commands.help;
		} else if (lowerCmd === 'experience') {
			output = commands.experience;
		} else if (lowerCmd === 'education') {
			output = commands.education;
		} else if (lowerCmd === 'skills') {
			output = commands.skills;
		} else if (lowerCmd !== '') {
			output = `command not found: ${input}. Try 'help'.`;
		}

		setHistory((prev) => [...prev, { command: input, output }]);
		setInput('');
	};

	return (
		<div className="flex flex-col h-full">
			<div className="rounded-lg border border-zinc-800 bg-black/50 backdrop-blur-md p-4 font-mono text-[13px] leading-relaxed tracking-wide text-zinc-300 flex-1 flex flex-col overflow-hidden">
				<div ref={terminalBodyRef} className="flex-grow overflow-y-auto no-scrollbar space-y-3">
					{history.map((entry, index) => (
						<div key={index} className="space-y-1">
							{entry.command && <Prompt>{entry.command}</Prompt>}
							<div
								className="whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-300"
								dangerouslySetInnerHTML={{
									__html: entry.output
										.replace(/&/g, '&amp;')
										.replace(/</g, '&lt;')
										.replace(/>/g, '&gt;')
										.replace(/\n/g, '<br />'),
								}}
							/>
						</div>
					))}
				</div>
				<form onSubmit={handleSubmit} className="mt-4 pt-2 border-t border-zinc-800/40">
					<Prompt>
						<input
							type="text"
							className="w-full bg-transparent border-none outline-none text-[13px] leading-relaxed text-zinc-100 focus:ring-0 p-0"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							autoFocus
						/>
					</Prompt>
				</form>
			</div>
			<div className="mt-4 rounded-md border border-zinc-800/60 bg-zinc-900/40 p-3 text-center text-[13px] text-zinc-400 shadow-sm">
				Non-technical user? Type <span className="text-teal-400 font-mono">help</span> in the prompt above to explore my CV.
			</div>
		</div>
	);
}
