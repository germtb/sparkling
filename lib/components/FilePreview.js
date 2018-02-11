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

		// atom.views.addViewProvider(TextEditor, textEditor => {
		// 	textEditorElement = new TextEditorElement()
		// 	textEditorElement.initialize(textEditor)
		// 	textEditorElement
		// })
		//

		const model = this.editor.getModel()

		TextBuffer.load(fileName).then(buffer => {
			model.buffer = buffer
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
