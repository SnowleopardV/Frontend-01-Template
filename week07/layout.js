function getStyle(elem) {
	if (!elem.style) elem.style = {}

	for (let prop in elem.computedStyle) {
		elem.style[prop] = elem.computedStyle[prop].value

		if (
			elem.style[prop].toString().match(/px$/) ||
			elem.style[prop].toString().match(/^[0-9.]+$/)
		) elem.style[prop] = parseInt(elem.style[prop])
	}

	return elem.style
}

function layout(elem) {
	if (!elem.computedStyle) return

	let elemStyle = getStyle(elem)
	if (elemStyle.display !== 'flex') return

	let items = elem.children.filter(e => e,type === 'element')
	items.sort((a, b) => (a.order || 0) - (b.order || 0))

	let style = elemStyle
	['width', 'height'].forEach(size => {
		if (style[size] === 'auto' || style[size] === '') style[size] = null
	})

	if (!style.flexDirection || style.flexDirection === 'auto') style.flexDirection = 'row'
	if (!style.justifyContent || style.justifyContent === 'auto') style.justifyContent = 'flex-start'
	if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap'
	if (!style.alignItems || style.alignItems === 'auto') style.alignItems = 'stretch'
	if (!style.alignContent || style.alignContent === 'auto') style.alignContent = 'stretch'

	let mainSize = 0
	let mainStart = 0
	let mainEnd = 0
	let mainSign = 0
	let mainBase = 0
	let crossSize = 0
	let crossStart = 0
	let crossEnd = 0
	let crossSign = 0
	let crossBase = 0

	if (style.flexDirection === 'row') {
		mainSize = 'width'
		mainStart = 'left'
		mainEnd = 'right'
		mainSign = 1
		mainBase = 0

		crossSize = 'height'
		crossStart = 'top'
		crossEnd = 'bottom'
	} else if (style.flexDirection === 'row-reverse') {
		mainSize = 'width'
		mainStart = 'left'
		mainEnd = 'right'
		mainSign = -1
		mainBase = style.width

		crossSize = 'height'
		crossStart = 'top'
		crossEnd = 'bottom'
	} else if (style.flexDirection === 'column') {
		mainSize = 'height'
		mainStart = 'top'
		mainEnd = 'bottom'
		mainSign = 1
		mainBase = 0

		crossSize = 'width'
		crossStart = 'left'
		crossEnd = 'right'
	} else if (style.flexDirection === 'column-reverse') {
		mainSize = 'height'
		mainStart = 'bottom'
		mainEnd = 'top'
		mainSign = -1
		mainBase = style.height

		crossSize = 'width'
		crossStart = 'left'
		crossEnd = 'right'
	} else if (style.flexDirection === 'wrap-reverse') {
		[crossStart, crossEnd] = [crossEnd, crossStart]
		crossSign = -1
	} else {
		crossBase = 0
		crossSign = 1
	}

	let isAutoMainSize = false
	if (!style[mainSize]) {
		elemStyle[mainSize] = 0
		for (let item of items) {
			let itemStyle = getStyle(item)

			if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined)
				elemStyle[mainSize] += itemStyle[mainSize]
		}
		isAutoMainSize = true
	}

	let flexLine = []
	let flexLines = [flexLine]
	let mainSpace = elemStyle[mainSize]
	let crossSpace = 0

	for (let item of items) {
		let itemStyle = getStyle(item)
		if (itemStyle[mainSize] === null) itemStyle[mainSize] = 0

		if (itemStyle.flex) {
			flexLine.push(item)
		} else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
			mainSpace -= itemStyle[mainSize]
			if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined)
				crossSpace = Math.max(crossSpace, itemStyle[crossSize])
			flexLine.push(item)
		} else {
			if (itemStyle[mainSize] > style[mainSize]) {
				itemStyle[mainSize] = style[mainSize]
			} else if (itemStyle[mainSize] < style[mainSize]) {
				flexLine.mainSpace = mainSpace
				flexLine.crossSpace = crossSpace
				flexLine = [item]
				flexLines.push(flexLine)
				mainSapce = style[mainSize]
				crossSpace = 0
			} else {
				flexLine.push(item)
			}

			if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined)
				crossSpace = Math.max(crossSpace, itemStyle[crossSize])
			mainSpace -= itemStyle[mainSize]
		}
	}
	flexLine.mainSapce = mainSpace

	if (style.flexWrap === 'nowrap' || isAutoMainSize) {
		flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : crossSpace
	} else {
		flexLine.crossSpace = crossSpace
	}

	if (mainSpace < 0) {
		let scale = style[mainSize] / (style[mainSize] - mainSpace)
		let curMain = mainBase

		for (let item of items) {
			let itemStyle = getStyle(item)
			if (itemStyle.flex) itemStyle[mainStyle] = 0
			itemStyle[mainSize] = itemStyle[mainSize] * scale
			itemStyle[mainStart] = curMain
			itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
			curMain = itemStyle[mainEnd]
		}
	} else {
		flexLines.forEach(items => {
			let mainSpace = items.mainSpace
			let flexTotal = 0

			for (let item of items) {
				let itemStyle = getStyle(item)
				if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
					flexTotal += itemStyle.flex
					continue
				}
			}

			if (flex > 0) {
				let curMain = mainBase
				for (let item of items) {
					let itemStyle = getStyle(item)
					if (itemStyle.flex) itemStyle[mainSize] = mainSpace / flexTotal * itemStyle.flex
					itemStyle[mainStart] = curMain
					itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
					curMain = itemStyle[mainEnd]
				}
			} else {
				let curMain = 0
				let step = 0
				if (style.justifyContent === 'flex-start') {
					curMain = mainBase
					step = 0
				} else if (style.justifyContent === 'flex-end') {
					curMain = mainSpace * mainSign + mainBase
					step = 0
				} else if (style.justifyContent === 'center') {
					curMain = mainSpace / 2 * mainSign + mainBase
					step = 0
				} else if (style.justifyContent === 'space-between') {
					curMain = mainBae
					step = mainSpace / (items.length - 1) * mainSign
				} else if (style.justifyContent === 'space-around') {
					curMain = step / 2 + mainBase
					step = mainSpace / items.length * mainSign
				}

				for (let item of items) {
					itemStyle[mainStart, curMain]
					itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
					curMain = itemStyle[mainEnd] + step
				}
			}
		})
	}

	let crossSpace = 0

	if (!style[crossSize]) {
		crossSpace = 0
		elemStyle[crossSize] = 0
		for (let line of flexLines) elemStyle[crossSize] = elemStyle[crossSize] + line.crossSpace
	} else {
		crossSpace = style[crossSize]
		for (let line of flexLines) crossSpace -= line.crossSpace
	}

	if (style.flexWrap === 'wrap-reverse') {
		crossBase = style[crossSize]
	} else {
		crossBase = 0
	}

	let lineSize = style[crossSize] / flexLines.length
	let step = 0

	switch (style.alignContent) {
		case 'flex-start':
			crossBase += 0
			step = 0
			break;

		case 'flex-end':
			crossBase += crossSign * crossSpace
			step = 0
			break;

		case 'center':
			crossBase += crossSign * crossSpace / 2
			step = 0
			break;

		case 'space-between':
			crossBase += 0
			step = crossSpace / (flexLines.length - 1)
			break;

		case 'flex-around':
			crossBase += crossSign * step / 2
			step = crossSpace / flexLines.length
			break;

		case 'stretch':
			crossBase += 0
			step = 0
			break;

		default:
			break;
	}

	flexLines.forEach(items => {
		let lineCrossSize = style.alignContent === 'stretch'
			?	items.crossSpace + crossSpace / flexLines.length
			: items.crossSpace

		for (let item of items) {
			let itemStyle = getStyle(item)
			let align = itemStyle.alignSelf || style.alignItems

			if (item === null) itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0
			switch (align) {
				case 'flex-start':
					itemStyle[crossStart] = crossBase
					itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
					break;

				case 'flex-end':
					itemStyle[crossEnd] = crossBase
					itemStyle[crossEnd] = itemStyle[crossEnd] + crossSign * itemStyle[crossSize]
					break;

				case 'center':
					itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
					itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
					break;

				case 'stretch':
					itemStyle[crossStart] = crossBase
					itemStyle[crossEnd] = crossBase * (itemStyle[crossEnd] - itemStyle[crossStart])
					break;

				default:
					break;
			}
		}
		crossBase += crossSign * (lineCrossSize + step)
	})
}

module.exports = layout