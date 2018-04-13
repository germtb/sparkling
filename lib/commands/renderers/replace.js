

import { getReplace } from '../../selectors'
import { split } from '../../utils'

                                    

                                                            

export default ({
	React,
	classnames,
	connect,
	utils: { iconClassForPath }
}              ) => {
	const Replace = ({
		item,
		wrappedValue,
		className,
		accept,
		replace
	}   
                    
                                                
                    
                  
                              
                 
  ) => {
		const { startColumn, endColumn, path } = item

		const wrapLine = (
			line                                 ,
			index        ,
			lines                                        
		) => {
			if (index === 0) {
				return (
					<div>
						<span
							className={classnames(
								'icon',
								'sparkling-path',
								...iconClassForPath(path)
							)}>
							{line}
						</span>
					</div>
				)
			} else if (index === 1 && lines.length === 2) {
				return (
					<div>
						<span>{line.slice(0, startColumn)}</span>
						<span className="replace-downlight">
							{line.slice(startColumn, endColumn)}
						</span>
						<span className="replace-highlight">{replace}</span>
						<span>{line.slice(endColumn)}</span>
					</div>
				)
			} else if (index === 1) {
				return (
					<div>
						<span>{line.slice(0, startColumn)}</span>
						<span className="replace-downlight">{line.slice(startColumn)}</span>
					</div>
				)
			} else if (index === lines.length - 1) {
				return (
					<div>
						<span className="replace-downlight">
							{line.slice(0, endColumn)}
						</span>
						<span className="replace-highlight">{replace}</span>
						<span>{line.slice(endColumn)}</span>
					</div>
				)
			}

			return <div className="replace-downlight">{line}</div>
		}

		const lines = wrappedValue.reduce(split('\n'), [[]]).map(wrapLine)

		const finalClassName = classnames(className, 'sparkling-row__find', {
			['sparkling-row__find--multiline']: lines.length > 1
		})

		return (
			<div
				className={finalClassName}
				aria-role="button"
				onClick={() => accept(item)}>
				{lines}
			</div>
		)
	}

	const ReplaceWithConnect = connect(state => ({
		replace: getReplace(state)
	}))(Replace)

	return (props   
                    
                                                
                    
                  
                
                        
                              
                 
  ) => <ReplaceWithConnect {...props} />
}
