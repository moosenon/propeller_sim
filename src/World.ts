import { Canvas } from './Canvas'
import * as dat from 'dat.gui'
import { Camera } from './Camera'
import { Rod } from './Rod'

export class World {
    canvas: Canvas
    camera: Camera
    rod: Rod
    t: number
    substeps: number
    gui: dat.GUI
    guiContainer: HTMLElement | undefined
    stopped: boolean
    private paused: boolean

    constructor(c: HTMLCanvasElement, guiContainer?: HTMLElement) {
        this.t = 0
        this.substeps = 1
        this.canvas = new Canvas(c)
        this.canvas.fillBackground(0xffffff)
        this.rod = new Rod(1, 1, 1, 0.1)
        this.camera = new Camera(this.canvas, this.rod)

        this.guiContainer = guiContainer
        if(this.guiContainer != undefined) {
            this.gui = new dat.GUI({autoPlace: false})
            this.guiContainer.appendChild(this.gui.domElement)
        } else {
            this.gui = new dat.GUI()
        }
        this.stopped = true
        this.paused = false

        this.setupGui()

        this.render()
        this.loop();
    }

    private setupGui() {
        let runner = this.gui.add(this, "stopped", true)
        const reset = () => { 
            this.paused = false
            this.reset() 
        }
        const pause = () => { 
            this.paused = true 
            this.reset()
        }

        this.gui.add(this.rod, "force", 0.1, 10, 0.1)
            .onChange(pause)
            .onFinishChange(reset)
        this.gui.add(this.rod, "mass", 0.5, 10, 0.1)
            .onChange(pause)
            .onFinishChange(reset)
        this.gui.add(this.rod, "length", 0.1, 10, 0.1)
            .onChange(pause)
            .onFinishChange(reset)
        this.gui.add(this, "substeps", 1, 20, 1)
            .onChange(pause)
            .onFinishChange(reset)
    }

    animate() {
        if(!this.canvas.inView()) {
            return
        }
        if(!this.paused) {
            this.runPhysics()
        }
        this.render()
    }

    runPhysics() {
        const dt = 1/60
        this.t += dt
        const physdt = dt/this.substeps
        for(let i = 0; i < this.substeps; i++) {
            this.rod.step(physdt)
        }
    }

    render() {
        this.canvas.fillBackground(0xffffff)
        this.camera.setPos(this.rod.x, this.rod.y)
        this.camera.drawGrid()
        this.camera.drawRod()
    }

    reset() {
        this.t = 0
        this.rod.reset()
        this.render()
    }

    start() {
        this.stopped = false
    }

    stop() {
        this.stopped = true
    }

    loop() {
        if(!this.stopped) {
            this.animate()
        }
        requestAnimationFrame( () => { this.loop() } )
    }

}
