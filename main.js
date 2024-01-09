const mainCanvas = document.querySelector('#mainCanvas')
mainCanvas.width = 800
mainCanvas.height = 600

const mainCtx = mainCanvas.getContext('2d')

class CtxHelper {
    #ctx
    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(ctx) {
        this.#ctx = ctx
    }

    validateLimits(obj) {
        const { x, y, w, h } = obj
        if (x > mainCanvas.width - w) {
            obj.x = mainCanvas.width - w
        } else if (x < 0) {
            obj.x = 0
        } else {
            obj.x = x
        }
        if (y > mainCanvas.height - h) {
            obj.y = mainCanvas.height - h
        } else if (y < 0) {
            obj.y = 0
        } else {
            obj.y = y
        }
        return obj
    }
    
    /**
     * 
     * @param {Obj} obj 
     * @param {Obj} obj2 
     */
    validateCollision(obj, obj2) {
        const {x, y, w, h} = obj
        const {x: ox, y: oy, w: ow, h: oh} = obj2
        // Validação 1: Está colidindo ao mover-se para a direita
        if ((x + w) > ox && !(x > ox + ow - w)) {
            obj.x = ox - w
        }
        // Validação 2: Está colidindo ao mover-se para baixo
        if ((y + h) > oy && !(y > oy + oh - h)) {
            obj.y = oy - h
        }
        // Validação 3: Está colidindo ao mover-se para a esquerda
        if (x < (ox + ow) && !(x < ox)) {
            obj.x = ox + ow
        }
        // Validação 4:
        if (y < (oy + oh) && !((y) < oy)) {
            obj.y = oy + oh
        }
    }

    clearCanvas() {
        this.#ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
    }

    drawRect(obj, otherObjs) {
        otherObjs = otherObjs.filter((otherObj) => !(otherObj instanceof Player))
        const {x, y, w, h} = obj
        this.validateLimits(obj)
        otherObjs.forEach((otherObj) => {
            this.validateCollision(obj, otherObj)
        })
        this.#ctx.strokeRect(obj.x, obj.y, w, h)
    }
}

class Obj {
    constructor(x, y, w, h, helper) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.ctxHelper = helper
    }

    draw(otherObjs) {
        this.ctxHelper.drawRect(this, otherObjs)
    }
}

class ControllableObject extends Obj {
    constructor(x, y, w, h, helper) {
        super(x, y, w, h, helper)
        this.speed = 10
        window.addEventListener('keydown', (e) => this.handleKeyDown(e))
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    handleKeyDown(e) {
        const pressedKey = e.key
        if (!pressedKey) return;
        switch (pressedKey) {
            case 'a':
            case 'A':
                // for (let i = 0; i < this.speed; i += 0.1) {
                //     this.x -= 0.1
                // }
                this.x -= this.speed;
                break;
            case 'd':
            case 'D':
                this.x += this.speed;
                break;
            case 's':
            case 'S':
                this.y += this.speed;
                break;
            case 'w':
            case 'W':
                this.y -= this.speed;
                break;
            case 'Enter':
                console.log(this)
        }
    }
}

class Player extends ControllableObject {
    /**
     * 
     * @param {CtxHelper} helper 
     */
    constructor(helper) {
        super(0, 0, 10, 10, helper)
    }
}

class Game {
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(ctx) {
        this.helper = new CtxHelper(ctx)
        this.player = new Player(this.helper)
        this.objects = []
        this.objects.push(this.player)
        this.objects.push(new Obj(100, 100, 50, 50, this.helper))
    }

    /**
     * 
     * @param {Obj} obj 
     */
    spawnObject(obj) {
        this.objects.push(obj)
    }

    render() {
        this.helper.clearCanvas()
        for (const obj of this.objects) {
            const auxObjs = this.objects.filter((ob) => ob !== obj)
            // auxObjs.filter(aux => !(aux instanceof Player)).forEach(aux => aux.x += 0.1)
            obj.draw(auxObjs)
        }
    }
}

let game;

function getGame(ctx) {
    if (!game) {
        game = new Game(ctx)
    }
    return game;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function mainLoop(ctx) {
    const game = getGame(ctx)
    game.render()
}

window.setInterval(() => mainLoop(mainCtx), 16.66)
