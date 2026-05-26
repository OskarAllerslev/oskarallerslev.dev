import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

export default function GitHubCard() {
	const githubTheme = {
		level0: '#161b22',
		level1: '#0e4429',
		level2: '#006d32',
		level3: '#26a641',
		level4: '#39d353',
	};

	return (
		<GitHubCalendar
			username="oskarallerslev"
			theme={githubTheme}
			blockSize={12}
			blockMargin={4}
			fontSize={14}
			hideTotalCount
			hideColorLegend
		/>
	);
}
