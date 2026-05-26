import React from 'react';

const experiences = [
	{
		name: 'Festina Finance',
		role: 'Incoming (July 2026)',
		initials: 'FF',
		color: 'bg-blue-900/50 text-blue-300',
	},
	{
		name: 'PFA Pension',
		role: 'Student Actuary, Insurance Insights',
		initials: 'PFA',
		color: 'bg-teal-900/50 text-teal-300',
	},
	{
		name: 'University of Copenhagen',
		role: 'MSc Actuarial Mathematics',
		initials: 'UCPH',
		color: 'bg-red-900/50 text-red-300',
	},
];

export default function ExperienceCard() {
	return (
		<div className="flex h-full flex-col">
			<h4 className="text-lg font-bold text-zinc-100">Experience &amp; Education</h4>
			<div className="mt-4 flex flex-grow flex-col justify-center gap-4">
				{experiences.map((exp, index) => (
					<div key={index} className="flex items-center">
						<div
							className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${exp.color}`}
						>
							{exp.initials}
						</div>
						<div>
							<p className="font-semibold text-zinc-200">{exp.name}</p>
							<p className="text-xs text-zinc-400">{exp.role}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
