export class Rod {
    x: number
    y: number
    vx: number
    vy: number
    ax: number
    ay: number
    theta: number
    omega: number
    alpha: number
    mass: number
    force: number
    length: number
    width: number
    private widthRatio: number

    constructor(force: number, mass: number, length: number, widthRatio = 0.1) {
        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.ax = 0
        this.ay = 0
        this.theta = 0
        this.omega = 0
        this.alpha = 0
        this.mass = mass // kilograms
        this.force = force // Newtons
        this.length = length // meters
        this.widthRatio = widthRatio // meters
        this.width = this.length*this.widthRatio
    }

    reset() {
        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.ax = 0
        this.ay = 0
        this.theta = 0
        this.omega = 0
        this.alpha = 0
        this.resetWidth()
    }

    resetWidth() {
        this.width = this.length*this.widthRatio
    }

    applyForce() {
        // Linear acceleration
        let fx = -this.force*Math.sin(this.theta)
        let fy = this.force*Math.cos(this.theta)
        this.ax = fx/this.mass
        this.ay = fy/this.mass
        
        // Angular acceleration
        let T = this.force*this.length/2 
        let I = this.mass*(this.length**2)/12
        this.alpha = T/I
    }

    step(dt: number) {
        this.applyForce()
        this.vx += this.ax * dt
        this.vy += this.ay * dt
        this.x += this.vx * dt
        this.y += this.vy * dt
        this.omega += this.alpha * dt
        this.theta += this.omega * dt
    }
}
