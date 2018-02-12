import React, { PureComponent } from 'react'
import { TextBuffer, TextEditor } from 'atom'
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

		atom.workspace.createItemForURI(fileName).then(textEditor => {
			console.log('textEditor: ', textEditor)
			const textEditorElement = new TextEditorElement()
			console.log('textEditorElement: ', textEditorElement)
			textEditorElement.initialize(textEditor)
			console.log('this.container: ', this.container)
			this.container.appendChild(textEditorElement)
		})

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
		// <atom-text-editor
		// 	class="editor"
		// 	data-encoding="utf-8"
		// 	ref={editor => (this.editor = editor)}
		// />
		return <div ref={container => (this.container = container)} />
	}
}
