import * as Matter from 'matter-js'
import { ground } from './env.ts'

interface RiderInterface {
	car: Matter.Composite,
	speedLimit?: number,
	onAir(): boolean,
	move(vector: Matter.Vector): void,
	rotate(angle: number): void
}

const wheelSize: number = 20

let Rider: RiderInterface = {
	car: Matter.Composites.car(75, 100, 100, 20, wheelSize),
	speedLimit: 20,
	onAir: function() {
		let collideWith: Array<Matter.Body> = ground.filter(el => {
			if ((Matter as any).SAT.collides(Rider.car.bodies[1], el).collided || (Matter as any).SAT.collides(Rider.car.bodies[2], el).collided) {
				return el
			}
		})
		return collideWith.length === 0
	},
	move: function(vector) {
		let car = this.car.bodies[0]
		if (car.speed < this.speedLimit && !this.onAir()) {
			Matter.Body.applyForce(car, { x: car.position.x, y: car.position.y }, vector)
		}
	},
	rotate: function(angle) {
		let car = this.car.bodies[0]
		this.onAir() ? angle *= 1.5 : angle *= .75
		Matter.Body.rotate(car, angle)
	}
}

let bodyRenderOption: Matter.IBodyRenderOptions = {
	fillStyle: '#6E95AA',
	strokeStyle: '#3465B0',
	lineWidth: 0,
	opacity: 1,
	visible: true
}

let wheelRenderOption: Matter.IBodyRenderOptions = {
	fillStyle: '#357799',
	strokeStyle: '#2C627E',
	lineWidth: 5,
	opacity: 1,
	visible: true
}

let constrainRenderOption: Matter.IConstraintRenderDefinition = {
	strokeStyle: '#2C627E',
	lineWidth: 5,
	visible: true
}


Rider.car.bodies[0].render = bodyRenderOption
Rider.car.bodies[1].render = wheelRenderOption
Rider.car.bodies[2].render = wheelRenderOption
Rider.car.constraints[0].render = constrainRenderOption
Rider.car.constraints[1].render = constrainRenderOption

console.log(Rider.car)

// Car - Midlle
Matter.Body.set(Rider.car.bodies[0], 'mass', 1)
Matter.Body.set(Rider.car.bodies[0], 'frictionAir', 0.001)
Matter.Body.set(Rider.car.bodies[0], 'frictionStatic', 2)


// Car - Wheels
Matter.Body.set(Rider.car.bodies[1], 'restitution', .5)
Matter.Body.set(Rider.car.bodies[2], 'restitution', .5)
Matter.Body.set(Rider.car.bodies[1], 'friction', .5)
Matter.Body.set(Rider.car.bodies[2], 'friction', .5)
Matter.Body.set(Rider.car.bodies[1], 'frictionAir', 0.001)
Matter.Body.set(Rider.car.bodies[2], 'frictionAir', 0.001)
Matter.Body.set(Rider.car.bodies[1], 'mass', .5)
Matter.Body.set(Rider.car.bodies[2], 'mass', .5)




export { Rider }
