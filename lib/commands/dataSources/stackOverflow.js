const https = require('https')

export default () => onData => {
	https
		.get(
			'https://api.stackexchange.com/2.2/search?page=1&pagesize=20&order=desc&sort=activity&tagged=redux&site=stackoverflow',
			resp => {
				let data = ''

				resp.on('data', chunk => {
					data += chunk
				})

				resp.on('end', () => {
					const parsedData = JSON.parse(data)
					console.log('data: ', data)
					console.log('parsedData: ', parsedData)
					onData([])
				})
			}
		)
		.on('error', err => {
			console.log('Error: ' + err.message)
		})

	return () => {}
}
