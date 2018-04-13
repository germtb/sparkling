

                                               

export default ({
	fileIconsService
}   
                                   
 ) => ({
	iconClassForPath: (path        )                => {
		return fileIconsService ? fileIconsService.iconClassForPath(path) : ['']
	}
})
