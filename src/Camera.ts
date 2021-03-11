import { Canvas } from './Canvas'
import { Rod } from './Rod'

const maxPPM = 300; // For one meter rod
export class Camera {
    private x: number
    private y: number
    private xOffset: number
    private yOffset: number
    private gridSize: number
    ppm: number // Pixels per meter
    canvas: Canvas
    rod: Rod

    constructor(c: Canvas, r: Rod) {
        this.canvas = c;
        this.rod = r;
        this.x = 0;
        this.y = 0;
        this.xOffset = 0
        this.yOffset = 0
        this.gridSize = 0.125; // meters
        this.setPos(0, 0)
        this.ppm = maxPPM / this.rod.length;
    }

    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.xOffset = this.x - (this.canvas.width / 2)
        this.yOffset = -this.y - (this.canvas.height / 2)
    }

    setPPM() {
        this.ppm = maxPPM / this.rod.length
        this.ppm = Math.min(this.canvas.height / 2, maxPPM/this.rod.length)
    }

    drawGrid() {
        this.setPPM()
        let scale = this.ppm*(this.gridSize) 
        let xOffset = (this.x*this.ppm - (this.canvas.width/2)) % scale
        let yOffset = (-this.y*this.ppm - (this.canvas.height/2)) % scale
        this.canvas.drawGrid(scale, -xOffset, -yOffset);
    }

    drawRod() {
        const r = this.rod
        let cx = r.x - this.x
        let cy = r.y - this.y
        cx *= this.ppm
        cy *= -this.ppm
        cx += this.canvas.width/2
        cy += this.canvas.height/2
        const expectedVel = Math.sqrt(Math.PI*r.force*r.length/(12*r.mass))
        const vel = Math.sqrt(r.vx**2 + r.vy**2)

        // Draw Rod
        this.canvas.drawRotatedRect(
            cx,
            cy,
            r.length * this.ppm,
            r.width * this.ppm,
            r.theta,
            0xcc2222
        )

        // Draw expected velocity
        this.canvas.drawArrow(
            cx,
            cy,
            cx + (expectedVel*-Math.sqrt(2)*this.ppm/2),
            cy - (expectedVel*Math.sqrt(2)*this.ppm/2),
            r.width*this.ppm/3,
            r.width*this.ppm/2,
            0x222222
        )

        // Draw actual velocity
        this.canvas.drawArrow(
            cx,
            cy,
            cx + (r.vx*this.ppm),
            cy - (r.vy*this.ppm),
            r.width*this.ppm/3,
            r.width*this.ppm/2,
            0x22cc22
        )

        // Draw center of mass point
        this.canvas.drawCircle(
            cx,
            cy,
            r.width*this.ppm/6,
            0xcc22cc
        )
    }
}
