const images = require('images')

function render(viewport, elem) {
	if (elem.style) {
		const img = images(elem.style.width, elem.style.height)

		if (elem.style['background-color']) {
			let color = elment.style['background-color'] || 'rgb(0, 0, 0)'
			color.match(/rgb\((\d+), (\d+), (\d+)\)/)
			img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
			viewport.draw(img, elem.style.left || 0, elem.style.top || 0)
		}
	}

	if (elem.children) {
		for (let child of elem.children) render(viewport, child)
	}
}

module.exports = render