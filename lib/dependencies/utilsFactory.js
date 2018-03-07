// @flow

export default ({ fileIconsService }) => ({
	iconClassForPath: (path: string): Array<string> => {
		return fileIconsService ? fileIconsService.iconClassForPath(path) : ['']
	}
})
