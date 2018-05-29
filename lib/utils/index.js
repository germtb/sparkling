import nodePath from 'path'
import fs from 'fs'
import { spawn, spawnSync } from 'child_process'
import replaceTransformFactory from './replaceTransform'

export { parse, toAtomRange } from './parse'
export { ackmateParserFactory } from './ackmateParser'

export const gitStatusLabel = status => {
	if (['M ', ' M', 'MM'].includes(status)) {
		return 'modified'
	} else if (status === '??') {
		return 'untracked'
	} else if (['D ', ' D', 'DD'].includes(status)) {
		return 'deleted'
	} else if (['A ', ' A', 'AM'].includes(status)) {
		return 'new file'
	}

	return status
}

export const fileReplace = async ({
	path,
	endColumn,
	endLine,
	startColumn,
	startLine,
	replace
}) => {
	const cwd = atom.project.getPaths()[0]
	const absolutePath = nodePath.resolve(cwd, `./${path}`)

	const readStream = fs.createReadStream(absolutePath)
	const replaceStream = replaceTransformFactory({
		startLine,
		startColumn,
		endLine,
		endColumn,
		replace
	})
	const writeStream = fs.createWriteStream(
		absolutePath + '.tempWithAReallyLongHash'
	)

	await new Promise(resolve => {
		readStream
			.pipe(replaceStream)
			.pipe(writeStream)
			.on('finish', () => {
				spawnSyncInProject('rm', [absolutePath])
				spawnSyncInProject('mv', [
					absolutePath + '.tempWithAReallyLongHash',
					absolutePath
				])
				resolve()
			})
	})
}

export const escapeHTML = str =>
	str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

export const escapeRegExp = str =>
	str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

export const spawnInProject = (cmd, args) => {
	const cwd = atom.project.getPaths()[0]
	return spawn(cmd, args, {
		cwd
	})
}

export const spawnSyncInProject = (cmd, args) => {
	const cwd = atom.project.getPaths()[0]
	return spawnSync(cmd, args, {
		cwd
	})
}

export const split = splitValue => (acc, value) => {
	if (value === splitValue) {
		acc.push([])
	} else {
		acc[acc.length - 1].push(value)
	}

	return acc
}

export const compose = (...fs) => x => fs.reverse().reduce((acc, f) => f(acc), x);
