import { spawn } from 'child_process'
import defaultRenderer from '../components/defaultRenderer'

const loadData = onData => {
	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('rg', ['^.*$', '-n', '--max-filesize', '500K'], {
		cwd
	})
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.reduce((acc, value) => {
					const [path, lineNumber, line] = value.split(':', 3)
					if (line && line.length > 1) {
						acc.push({ value, path, line, lineNumber })
					}
					return acc
				}, [])
		)
	})

	return () => {
		cmdProcess.stdout.pause()
		cmdProcess.kill()
	}
}

export const allLinesFactory = (React, store) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept }
}

export const autocompleteLinesFactory = (React, store) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		editor.insertText(line.line)
	}

	const renderer = ({ line, ...props }) =>
		defaultRenderer({
			...props,
			value: line
		})

	return { loadData, accept, renderer }
}
