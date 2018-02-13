import fuzzaldrinPlus from 'fuzzaldrin-plus'

const data = process.argv[2]
const filteredData = fuzzaldrinPlus.filter(data, pattern, {
	key: 'value'
})
process.send(filteredData)
