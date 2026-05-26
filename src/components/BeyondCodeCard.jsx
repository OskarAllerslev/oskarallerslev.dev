import React from 'react';

const LightningIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className="mr-2 h-5 w-5 text-yellow-400"
		style={{ filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))' }}
	>
		<path
			fillRule="evenodd"
			d="M10.293 1.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L11 3.414V17a1 1 0 1 1-2 0V3.414L3.707 8.707a1 1 0 0 1-1.414-1.414l6-6zM11.3 1.046A1 1 0 0112 2v5.293l6.293-6.293a1 1 0 011.414 1.414L13.414 8.707H18a1 1 0 01.894 1.447l-8 10A1 1 0 018 20v-5.293l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 11.293H2a1 1 0 01-.894-1.447l8-10A1 1 0 0111.3 1.046z"
			clipRule="evenodd"
		/>
	</svg>
);

export default function BeyondCodeCard() {
	return (
		<div className="flex h-full flex-col justify-center">
			<h4 className="flex items-center text-lg font-bold text-zinc-100">
				<LightningIcon />
				Beyond Code
			</h4>
			<p className="mt-4 text-sm text-zinc-400">
				Applying data-driven optimization outside the terminal. Elite sprint swimmer (50m)
				utilizing structured biohacking and sleep analytics for peak performance.
			</p>
		</div>
	);
}
