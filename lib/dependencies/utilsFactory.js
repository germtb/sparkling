// @flow

import type { FileIconService } from '../types'

export default ({
	fileIconsService
}: {
	fileIconsService?: FileIconService
}) => ({
	iconClassForPath: (path: string): Array<string> => {
		return fileIconsService ? fileIconsService.iconClassForPath(path) : ['']
	}
})
