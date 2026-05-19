import { useState, useEffect, useRef } from 'react';

const commands = {
	help: `
        <p class="mb-1">This is an interactive terminal. Available commands:</p>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">experience</span><span>Display my professional work history.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">education</span><span>Show my academic background.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">skills</span><span>List my technical skills and stack.</span></div>
		<div class="flex"><span class="w-20 shrink-0 text-zinc-500">projects</span><span>View project stack.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">links</span><span>Display Github/Email links.</span></div>
        <div class="flex"><span class="w-20 shrink-0 text-zinc-500">clear</span><span>Reset the terminal.</span></div>
    `,
	experience: `
        <p class="font-bold text-zinc-100">Student Actuary, DevOps & Data Engineering</p>
        <p class="text-zinc-400">PFA Pension | Sep 2022 - Present</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
            <li>Developed and maintained actuarial models and data pipelines in R & Python.</li>
            <li>Implemented and managed CI/CD pipelines for automated testing and deployment.</li>
            <li>Worked with large-scale data processing and cloud infrastructure (Azure).</li>
        </ul>
    `,
	education: `
        <p class="font-bold text-zinc-100">MSc, Actuarial Mathematics</p>
        <p class="text-zinc-400">University of Copenhagen | 2022 - 2024</p>
        <p class="font-bold text-zinc-100 mt-2">BSc, Actuarial Mathematics</p>
        <p class="text-zinc-400">University of Copenhagen | 2019 - 2022</p>
    `,
	skills: `
        <p class="font-bold text-zinc-100">Languages:</p>
        <p>Rust, C++, R, Python, SQL, TypeScript</p>
        <p class="font-bold text-zinc-100 mt-2">Technologies:</p>
        <p>Docker, Kubernetes, Azure, Terraform, CI/CD, XGBoost, PyTorch, React</p>
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
        <div class="flex"><span class="w-16 shrink-0 text-zinc-500">GITHUB</span><a href="https://github.com/OskarAllerslev" target="_blank" rel="noopener noreferrer" class="text-teal-400 hover:underline">github.com/OskarAllerslev</a></div>
        <div class="flex"><span class="w-16 shrink-0 text-zinc-500">EMAIL</span><a href="mailto:Oskar.m1660@gmail.com" class="text-teal-400 hover:underline">Oskar.m1660@gmail.com</a></div>
    `,
};

const Prompt = ({ children }) => (
	<div className="flex">
		<div>
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
			output: "Welcome to Oskar's interactive portfolio. Type \"help\" for a tutorial.",
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
		} else if (lowerCmd === 'projects') {
			output = commands.projects;
		} else if (lowerCmd === 'links') {
			output = commands.links;
		} else if (lowerCmd !== '') {
			output = `<p>command not found: ${input}. Try 'help'.</p>`;
		}

		setHistory((prev) => [...prev, { command: input, output }]);
		setInput('');
	};

	return (
		<div className="rounded-lg border border-zinc-800 bg-black/50 backdrop-blur-md p-4 font-mono text-sm text-zinc-300 h-[600px] flex flex-col">
			<div ref={terminalBodyRef} className="flex-grow overflow-y-auto">
				{history.map((entry, index) => (
					<div key={index} className="mb-2">
						{entry.command && <Prompt>{entry.command}</Prompt>}
						<div dangerouslySetInnerHTML={{ __html: entry.output }} />
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="mt-2">
				<Prompt>
					<input
						type="text"
						className="w-full bg-transparent border-none outline-none"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						autoFocus
					/>
				</Prompt>
			</form>
		</div>
	);
}
