import * as Matter from 'matter-js'

interface Environnement {
	width: number,
	height: number,
	thickness?: number,
	groundWidth?: number
}

let env: Environnement = {
	width: window.innerWidth,
	height: window.innerHeight,
	thickness: 10,
	groundWidth: window.innerWidth * 20
}


function generatePoly(i: number, j?: number): Matter.Body {
	let height: number = Math.round(Math.random() * 200)
	let width: number = Math.round(Math.random() * 300);
	if (width < height) {
		let temp = width
		width = height
		height = temp
	}
	let x: number = i;
	let y: number = j ? j : env.height - (env.thickness + height) / 2
	let staticBody: boolean = false
	const colorArray: Array<string> = ['#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B']
	const polyArray: Array<string> = ['circle', 'polygon', 'trapezoid']
	let color: string = colorArray[Math.floor(Math.random() * colorArray.length)]
	if (j) {
		return Matter.Bodies.trapezoid(x, y, width, height, 1, {
			isStatic: staticBody,
			render: {
				fillStyle: color,
				strokeStyle: color
			}
		})
	}
	switch (polyArray[Math.floor(Math.random() * polyArray.length)]) {
		case 'circle':
			return Matter.Bodies.circle(x, y, height, {
				isStatic: staticBody,
				render: {
					fillStyle: color,
					strokeStyle: color
				}
			})
		case 'polygon':
			return Matter.Bodies.polygon(x, y, Math.floor(Math.random() * 10), height, {
				isStatic: staticBody,
				render: {
					fillStyle: color,
					strokeStyle: color
				}
			})
		case 'trapezoid':
			return Matter.Bodies.trapezoid(x, y, width, height, Math.floor(Math.random() * 2), {
				isStatic: staticBody,
				render: {
					fillStyle: color,
					strokeStyle: color
				}
			})
	}
}

let pathArray: Matter.Vector[][] = [
	Matter.Vertices.fromPath("0 300 150 10 300 300 0 300", undefined),
	Matter.Vertices.fromPath("0 300 300 10 300 300 0 300", undefined),
	Matter.Vertices.fromPath("0 300 150 10 150 230 300 300 0 300", undefined),
]


let backgroundArray: Array<Matter.Body> = [
	Matter.Bodies.rectangle(4359 * env.height / 1900 / 2 - 100, env.height / 2, 4359 * env.height / 1900, env.height, {
		isSensor: true,
		isStatic: true,
		render: {
			sprite: {
				texture: './dist/img/City_2.png',
				xScale: env.width * 2 / 4359,
				yScale: env.height / 1900,
			}
		}
	}),
	Matter.Bodies.rectangle(4359 * env.height / 1900 / 2 - 100, env.height / 2, 4359 * env.height / 1900, env.height, {
		isSensor: true,
		isStatic: true,
		render: {
			sprite: {
				texture: './dist/img/City_1.png',
				xScale: env.width * 2 / 4359,
				yScale: env.height / 1900,
			}
		}
	})
]


let ground: Array<Matter.Body> = [
	Matter.Bodies.rectangle(env.groundWidth / 2, env.height - env.thickness / 2, env.groundWidth, env.thickness, {
		isStatic: true,
		render: {
			fillStyle: '#2e2b44',
			strokeStyle: '2e2b44'
		}
	}),
	Matter.Bodies.rectangle(0, env.height / 2, 15, env.height, {
		isStatic: true,
		render: {
			fillStyle: '#2e2b44',
			strokeStyle: '2e2b44'
		}
	})
]

function generateBackground(x: number, width: number, density: number = 800): Array<Matter.Body> {
	let array: Array<Matter.Body> = []
	if (x + width > env.groundWidth) return
	for (let i = x; i < x + width; i += density) {
		array.push(
			generatePoly(i)
			// Matter.Bodies.fromVertices(i,
			// 	env.height - env.thickness / 2 - 101,
			// 	[pathArray[Math.floor(Math.random() * pathArray.length)]],
			// 	{ isStatic: true }, true)
		)
	}
	return array
}

ground.forEach(body => !body.isStatic ? Matter.Body.set(body, 'mass', 25) : body)
ground = ground.concat(backgroundArray).reverse()
console.log(ground)

export { env, ground, generatePoly, generateBackground }
