export default ({ React }) => ({ item, wrappedValue, className, accept }) => {
	return (
		<div className={className} aria-role="button" onClick={() => accept(item)}>
			{wrappedValue}
		</div>
	)
}
