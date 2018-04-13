

import { isVisible, getOptions } from '../../selectors'
import SparklingFactory from './Sparkling'

                                                               
                                                                        
// $FlowFixMe
                                                  

export default (dependencies              )                    => {
	const { React, connect } = dependencies

	const Sparkling = SparklingFactory(dependencies)

	const SparklingContainer                                
                   
                  
    = ({ visible, options }) => {
		if (!visible) {
			return null
		}

		return <Sparkling options={options} />
	}

	const mapStateToProps                               = (
		state       
	)                                         => ({
		visible: isVisible(state),
		options: getOptions(state)
	})

	return connect(mapStateToProps)(SparklingContainer)
}
