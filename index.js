const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;

        this.lastkey;

        this.attackBox = {
            width: 100,
            height: 50,
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
        };

        this.color = color;

        this.isAttacking;


    }
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.fillStyle = "green";
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        )
    }
    update() {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;

        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else
            this.velocity.y += gravity;
    }
    attack() {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false }, 100)
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0,
    }
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

let lastkey;

function rectangluarCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function animate() {
    window.requestAnimationFrame(animate);
    // console.log("animation");

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && lastkey === "a") {
        player.velocity.x = -5;
    } else if (keys.d.pressed && lastkey === "d") {
        player.velocity.x = 5;
    }
    if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
        enemy.velocity.x = 5;
    }

    if (rectangluarCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking
    ) {
        console.log('hit')
        player.isAttacking = false;
    }

    if (rectangluarCollision({ rectangle1: player, rectangle2: enemy }) && enemy.isAttacking
    ) {
        console.log('hit')
        enemy.isAttacking = false;
    }

}
animate();

window.addEventListener("keydown", (e) => {

    switch (e.key) {
        case "d":
            keys.d.pressed = true;
            lastkey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            lastkey = "a";
            break;
        case "w":
            player.velocity.y = -20;
            break;
        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = "ArrowRight";
            break; s
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
    };
})

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    };
});