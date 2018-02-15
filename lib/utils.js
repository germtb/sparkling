let fileIconsService = null

export const setFileIconsService = service => {
	fileIconsService = service
}

export const iconClassForPath = path => {
	return fileIconsService.iconClassForPath(path)
}
