let fileIconsService = null

export const setFileIconsService = service => {
	fileIconsService = service
}

export const iconClassForPath = path => {
	return fileIconsService.iconClassForPath(path)
}

export const interspere = (array, value) =>
	array.reduce((acc, s, index, array) => {
		acc.push(s)

		if (index < array.length - 1) {
			acc.push(value)
		}

		return acc
	}, [])
