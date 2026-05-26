import React from 'react';

const experiences = [
	{
		name: 'Festina Finance',
		role: 'Quantitative/Software Engineer',
		dates: 'July 2026 - Present',
		description: 'Incoming role focusing on financial software and scalable infrastructure.',
		initials: 'FF',
		color: 'bg-blue-900/50 text-blue-300',
	},
	{
		name: 'PFA Pension',
		role: 'Student Actuary, Insurance Insights',
		dates: 'June 2026',
		description:
			'Developing internal R packages (Lifepack), data pipelines, and quantitative reporting tools.',
		initials: 'PFA',
		color: 'bg-teal-900/50 text-teal-300',
	},
	{
		name: 'University of Copenhagen',
		role: 'MSc Actuarial Mathematics',
		dates: 'Expected 2026/2027',
		description:
			'Specializing in stochastic calculus, rough volatility, and machine learning. (BSc completed Jun 2024).',
		initials: 'UCPH',
		color: 'bg-red-900/50 text-red-300',
	},
];

export default function ExperienceCard() {
	return (
		<div className="flex h-full flex-col">
			<h4 className="text-lg font-bold text-zinc-100">Experience &amp; Education</h4>
			<div className="mt-4 flex flex-grow flex-col justify-around gap-y-4">
				{experiences.map((exp, index) => (
					<div key={index} className="flex items-start">
						<div
							className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${exp.color}`}
						>
							{exp.initials}
						</div>
						<div className="flex-1">
							<div className="flex items-baseline justify-between">
								<p className="font-semibold text-zinc-200">{exp.name}</p>
								<p className="text-xs text-zinc-500">{exp.dates}</p>
							</div>
							<p className="text-sm font-medium text-zinc-300">{exp.role}</p>
							<p className="mt-1 text-xs text-zinc-400">{exp.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
