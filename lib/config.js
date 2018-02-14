export default {
	files: {
		title: 'Find files with ripgrep',
		description:
			'Enable find files with ripgrep (requires ripgrep installed in path)',
		type: 'boolean',
		default: true
	},
	gitFiles: {
		title: 'Find files with git',
		description: 'Enable find files that have been modified according to git',
		type: 'boolean',
		default: true
	},
	gitBranches: {
		title: 'Checkout git branches',
		description: 'Enable checkout git branches',
		type: 'boolean',
		default: true
	},
	lines: {
		title: 'Find buffer lines',
		description: 'Enable find buffer lines',
		type: 'boolean',
		default: true
	},
	allLines: {
		title: 'Find project lines',
		description: 'Enable find project lines',
		type: 'boolean',
		default: true
	},
	autocompleteLines: {
		title: 'Autocomplete project lines',
		description: 'Enable autocomplete project lines',
		type: 'boolean',
		default: true
	}
}
