import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

export default function GitHubCard() {
	const labels = {
		totalCount: '{{count}} bidrag i {{year}}',
	};

	return (
		<div className="min-h-[150px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<GitHubCalendar
				username="oskarallerslev"
				colorScheme="dark"
				labels={labels}
				blockSize={12}
				blockMargin={4}
				fontSize={14}
				hideColorLegend
			/>
		</div>
	);
}
