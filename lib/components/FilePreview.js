import React, { PureComponent } from 'react'
import { TextBuffer, TextEditor, TextEditorElement } from 'atom'
import path from 'path'
import fs from 'fs'
import readline from 'readline'
import stream from 'stream'

module.exports = class FilePreview extends PureComponent {
	constructor(props) {
		super(props)
		this.state = { start: 0, end: 200 }
		this.readFile = this.readFile.bind(this)
	}

	readFile() {
		const cwd = atom.project.getPaths()[0]
		const { file } = this.props
		const fileName = path.join(cwd, file)

		const readStream = fs.createReadStream(fileName, {
			start: this.state.start,
			end: this.state.end
		})

		readStream.on('data', data => {
			const model = this.editor.getModel()
			const buffer = model.getBuffer()
			buffer.setText(data.toString('utf-8'))
		})
	}

	componentDidMount() {
		this.readFile()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.file === this.props.file) {
			return
		}

		this.readFile()
	}

	render() {
		return (
			<atom-text-editor
				class="editor"
				data-encoding="utf-8"
				ref={editor => (this.editor = editor)}
			/>
		)
	}
}
