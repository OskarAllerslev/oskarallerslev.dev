import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

export default function GitHubCard() {
	const labels = {
		totalCount: '{{count}} contributions in {{year}}',
	};

	const customTheme = {
		dark: ['#18181b', '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4'],
	};

	return (
		<div className="w-full overflow-x-auto no-scrollbar scroll-smooth py-2">
			<div className="min-w-[670px] md:min-w-[670px] lg:min-w-0 lg:w-full flex justify-center font-mono">
				<GitHubCalendar
					username="oskarallerslev"
					colorScheme="dark"
					theme={customTheme}
					labels={labels}
					blockSize={11}
					blockMargin={4}
					fontSize={12}
					hideColorLegend
					hideTotalCount={false}
				/>
			</div>
		</div>
	);
}
