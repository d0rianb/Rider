import * as Matter from 'matter-js'
import * as kd from 'keydrown'
import { env, ground, generatePoly, generateBackground } from './env.ts'
import { Rider } from './rider.ts'

/* TODO:
 * - Background w/ 3 layer & Parralax effect    | DONE
 * - Debug Mode                                 | DONE
 * - création d'un menu + afficheur             | DONE
 * - Generate ground                            |
 * - Physic adjustement                         | DONE
 * - Design adjustement                         |
 * - Move angle when car is in the air          | DONE
 * - Glow Effect								|
 */

let debug: boolean = false
let lastEnvCheckMax: number = 0
let lastEnvCheckMin: number = 0
let savedEnv: Array<Matter.Body> = []

const renderOption: object = {
	width: env.width,
	height: env.height,
	pixelRatio: 'auto',
	background: '#bbb',
	wireframeBackground: '#222',
	hasBounds: true,
	enabled: true,
	wireframes: debug,
	showSleeping: false,
	showDebug: debug,
	showBroadphase: debug,
	showBounds: debug,
	showVelocity: debug,
	showCollisions: debug,
	showSeparations: false,
	showAxes: false,
	showPositions: debug,
	showAngleIndicator: false,
	showIds: debug,
	showShadows: false,
	showVertexNumbers: false,
	showConvexHulls: false,
	showInternalEdges: false,
	showMousePosition: false
}

const engine: Matter.Engine = Matter.Engine.create()
const render: Matter.Render = Matter.Render.create({
	element: document.body,
	engine: engine,
	options: renderOption
})
const bounds: Matter.Bounds = Matter.Bounds

const helpMenu: HTMLElement = document.querySelector('.help')
const HTMLdebug: any = document.querySelector('#debug')

HTMLdebug.addEventListener('change', (e: any) => {
	const changeOption = [
		'wireframes',
		'showDebug',
		'showBroadphase',
		'showBounds',
		'showVelocity',
		'showCollisions',
		'showIds']
	debug = !debug;
	Object.keys(render.options).forEach(option => {
		if (changeOption.includes(option.toString())) {
			(render as any).options[option] = debug
		}
	})
})

function moveCamera(vector: Matter.Vector): void {
	Matter.Bounds.translate(render.bounds, vector)
}

function zoom(factor: number): void {
	let r: any = render.bounds
	let width: number = r.min.x + r.max.x
	let height: number = r.min.y + r.max.y
	let ratio: number = width / height
	let newWidth: number = width * factor
	let newHeight: number = height * factor;
	(render as any).bounds.min = { x: r.min.x - (width - newWidth) / 2, y: r.min.y - (height - newHeight) / 2 };
	(render as any).bounds.max = { x: r.max.x + (width - newWidth) / 2, y: r.max.y + (height - newHeight) / 2 }
}

function adjustCamera(): void {
	// if (debug) return
	const initY: number = 275
	if (!render.bounds.hasOwnProperty('min') && !render.bounds.hasOwnProperty('max')) return
	if (Rider.car.bodies[0].position.x < env.width / 2) return
	let diff: Matter.Vector = {
		x: Rider.car.bodies[0].position.x - ((render.bounds as any).min.x + (render.bounds as any).max.x) / 2,
		y: Rider.car.bodies[0].position.y - ((render.bounds as any).min.y + (render.bounds as any).max.y) / 2 - initY
	}
	moveCamera({ x: diff.x, y: 0 })
}

function map(n: any, start1: number, stop1: number, start2: number, stop2: number): number {
	return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

function adjustBackground() {
	if (Rider.car.bodies[0].position.x < env.width / 2) return
	let bg: Matter.Body = ground[0] // Background
	let bgWidth: number = 4359 * env.height / 1900
	let dx = Math.round(map(Rider.car.bodies[0].position.x, 75, env.groundWidth, bgWidth / 2, env.groundWidth - bgWidth / 4) - bg.position.x - env.width / 2)
	Matter.Body.translate(bg, { x: dx, y: 0 })

	let bg2: Matter.Body = ground[1] // Background
	let bg2Width: number = 4359 * env.height / 1900
	let dx2 = Math.round(map(Rider.car.bodies[0].position.x, 75, env.groundWidth, bg2Width / 2, env.groundWidth - bgWidth) - bg2.position.x - env.width / 2)
	Matter.Body.translate(bg2, { x: dx2, y: 0 })
}

function optimizeEnv(): void {
	let r: any = render.bounds
	if (r.max.x > lastEnvCheckMax + 2 * env.width) {
		console.log(ground)
		ground = ground.concat(generateBackground(r.max.x, 2 * env.width))
		lastEnvCheckMax = r.max.x
	}
	if (r.min.x > lastEnvCheckMin + env.width) {
		console.log('calls before')
		console.log(Matter.Composite.allBodies(engine.world))
		lastEnvCheckMin = r.min.x
	}
}

Matter.Events.on(engine, 'beforeUpdate', adjustCamera)
Matter.Events.on(render, 'beforeRender', optimizeEnv)
Matter.Events.on(render, 'afterRender', adjustBackground)

Matter.World.add(engine.world, ground)
Matter.World.add(engine.world, Rider.car)

Matter.Engine.run(engine)
Matter.Render.run(render)

let initialBoundsSpacementX = (render as any).bounds.max.x - (render as any).bounds.min.x
let initialBoundsSpacementY = (render as any).bounds.max.y - (render as any).bounds.min.y

kd.SPACE.down((e: any) => e.shiftKey ? Rider.move({ x: -.01, y: 0 }) : Rider.move({ x: .01, y: 0 }))
kd.RIGHT.down(() => Rider.rotate(.2))
kd.LEFT.down(() => Rider.rotate(-.2))
kd.Z.down(() => Matter.Bounds.translate(render.bounds, { x: 0, y: -10 }))
kd.S.down(() => Matter.Bounds.translate(render.bounds, { x: 0, y: 10 }))
kd.Q.down(() => Matter.Bounds.translate(render.bounds, { x: -10, y: 0 }))
kd.D.down(() => Matter.Bounds.translate(render.bounds, { x: 10, y: 0 }))
kd.R.down(() => {
	Matter.Bounds.shift(render.bounds, { x: 0, y: 0 });
	(render as any).bounds.max.x = (render as any).bounds.min.x + initialBoundsSpacementX;
	(render as any).bounds.max.y = (render as any).bounds.min.y + initialBoundsSpacementY
})
kd.ENTER.up(() => Matter.World.add(engine.world, generatePoly(Rider.car.bodies[0].position.x + 200, env.height / 2)))
kd.H.up(() => helpMenu.style.opacity === '0' ? helpMenu.style.opacity = '1' : helpMenu.style.opacity = '0')
kd.P.down(() => zoom(1.01))
kd.M.down(() => zoom(0.99))
kd.B.up(() => {
	HTMLdebug.checked = !HTMLdebug.checked;
	let evt: any = document.createEvent("HTMLEvents")
	evt.initEvent("change", false, true)
	HTMLdebug.dispatchEvent(evt)
})
kd.run(() => kd.tick())
