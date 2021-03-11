let maxHeightRatio = 0.8;

export class Canvas {
    c: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    width: number
    height: number
    pixelRatio: number

    constructor(canvas: HTMLCanvasElement) {
        this.c = canvas
        this.ctx = this.c.getContext("2d") as CanvasRenderingContext2D
        this.width = 0
        this.height = 0
        this.pixelRatio = 0

        this.autoResize()
        window.addEventListener("resize", () => { this.autoResize() })
    }

    autoResize() {
        let width: number
        if(this.c.parentElement == null) {
            width = window.innerWidth
        } else {
            width = this.c.parentElement.clientWidth
        }
        let height = Math.ceil(window.innerHeight*maxHeightRatio)
        height = (height < width) ? height : width
        this.c.style.width = width + "px"
        this.c.style.height = height + "px"
        this.width = width;
        this.height = height;

        this.pixelRatio = window.devicePixelRatio
        this.c.width = Math.floor(width * this.pixelRatio)
        this.c.height = Math.floor(height * this.pixelRatio)
        this.ctx.scale(this.pixelRatio, this.pixelRatio)
    }

    private colorToStyleString(color: number): string {
        let str = color.toString(16)
        while(str.length < 6) {
            str = "0"+str
        }
        str = "#" + str
        return str
    }
    
    fillBackground(color: number) {
        this.ctx.fillStyle = this.colorToStyleString(color)
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    drawGrid(
        pSpacing: number, 
        xpOffset: number, 
        ypOffset: number, 
        color = 0xaaaaaa
    ) {
        let vertLines = Math.ceil(this.width / pSpacing) + 3
        let horizLines = Math.ceil(this.height / pSpacing) + 3

        this.ctx.strokeStyle = this.colorToStyleString(color)
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for(let i = 0; i < horizLines; i++) {
            let y = i * pSpacing - (pSpacing / 0.5) + ypOffset
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(this.width, y)
        }
        for(let i = 0; i < vertLines; i++) {
            let x = i * pSpacing - (pSpacing / 0.5) + xpOffset
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, this.height)
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawCircle(
        x: number,
        y: number,
        radius: number,
        color = 0xff00ff
    ) {
        this.ctx.beginPath()
        this.ctx.moveTo(x+radius, y)
        this.ctx.arc(x, y, radius, 0, 2*Math.PI, false)
        this.ctx.fillStyle = this.colorToStyleString(color)
        this.ctx.fill()
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = "#000000"
        this.ctx.stroke()
        this.ctx.closePath()
    }

    drawArrow(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        thickness: number,
        headSize: number,
        color = 0x000000
    ) {
        const dy = y1 - y0
        const dx = x1 - x0
        const theta = Math.atan2(dy, dx)
        const ct = Math.cos(theta)
        const st = Math.sin(theta)
        const botMidX = x1-headSize*ct
        const botMidY = y1-headSize*st
        const colorStr = this.colorToStyleString(color)
        this.ctx.strokeStyle = "#000000"
        this.ctx.fillStyle = colorStr
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(x0-thickness*st/2, y0+thickness*ct/2);
        this.ctx.lineTo(x0+thickness*st/2, y0-thickness*ct/2);
        this.ctx.lineTo(botMidX+thickness*st/2, botMidY-thickness*ct/2);
        this.ctx.lineTo(botMidX-thickness*st/2, botMidY+thickness*ct/2);
        this.ctx.lineTo(x0-thickness*st/2, y0+thickness*ct/2);
        this.ctx.stroke()
        this.ctx.fill()
        this.ctx.closePath()

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1)
        const halfWidth = 2*headSize/Math.tan(7*Math.PI/18)
        this.ctx.lineTo(botMidX-halfWidth*st, botMidY+halfWidth*ct)
        this.ctx.lineTo(botMidX+halfWidth*st, botMidY-halfWidth*ct)
        this.ctx.lineTo(x1, y1)
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.closePath()
    }

    drawRotatedRect(
        x: number,
        y: number,
        length: number,
        width: number,
        theta: number,
        color = 0x881818
    ) {
        let c = Math.cos(-theta)
        let s = Math.sin(-theta)
        let p1x = x + (length/2)*c - (width/2)*s
        let p1y = y + (length/2)*s + (width/2)*c
        let p2x = x + (length/2)*c + (width/2)*s
        let p2y = y + (length/2)*s - (width/2)*c
        let p3x = x - (length/2)*c + (width/2)*s
        let p3y = y - (length/2)*s - (width/2)*c
        let p4x = x - (length/2)*c - (width/2)*s
        let p4y = y - (length/2)*s + (width/2)*c
        this.ctx.beginPath()
        this.ctx.moveTo(p1x, p1y)
        this.ctx.lineTo(p2x, p2y)
        this.ctx.lineTo(p3x, p3y)
        this.ctx.lineTo(p4x, p4y)
        this.ctx.lineTo(p1x, p1y)
        this.ctx.lineTo(p2x, p2y)
        this.ctx.fillStyle = this.colorToStyleString(color)
        this.ctx.fill()
        this.ctx.lineWidth = Math.ceil(width/6)
        this.ctx.strokeStyle = "#000000"
        this.ctx.stroke()
        this.ctx.closePath()
    }
}
