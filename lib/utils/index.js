// @flow

import nodePath from 'path'
import fs from 'fs'
import { spawn, spawnSync } from 'child_process'
import replaceTransformFactory from './replaceTransform'

export { parse, toAtomRange } from './parse'
export { ackmateParserFactory } from './ackmateParser'

export const fileReplace = async ({
	path,
	endColumn,
	endLine,
	startColumn,
	startLine,
	replace
}: {
	path: string,
	endColumn: number,
	endLine: number,
	startColumn: number,
	startLine: number,
	replace: string
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

export const escapeHTML = (str: string): string =>
	str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

export const spawnInProject = (cmd: string, args: Array<string>) => {
	const cwd = atom.project.getPaths()[0]
	return spawn(cmd, args, {
		cwd
	})
}

export const spawnSyncInProject = (cmd: string, args: Array<string>) => {
	const cwd = atom.project.getPaths()[0]
	return spawnSync(cmd, args, {
		cwd
	})
}

export const split = <T1, T2>(splitValue: T1) => (
	acc: Array<Array<T1 | T2>>,
	value: T1 | T2
) => {
	if (value === splitValue) {
		acc.push([])
	} else {
		acc[acc.length - 1].push(value)
	}

	return acc
}
