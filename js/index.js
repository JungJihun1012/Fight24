const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "",
});

c.fillRect(0, 0, canvas.width, canvas.height);



const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0,
    },
})

// 2p 선언
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10,
    },
    // 캐릭터 색상 지정
    color: "blue",
    // 어택박스 기준
    offset: {
        x: -50,
        y: 0,
    },
})

// 키 입력을 저장하는 변수
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },


}

// 마지막으로 입력한 키를 저장하는 변수
let lastkey;

function rectangularCollision({ rectangle1, rectangle2 }) {
    // 충돌판정 어택박스의 크기와 2p의 x,y,width,height를 비교
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}


function determineWinner({ player, enemy, timerID }) {

    // 체력이 0이 될 경우 타이머 중단을 위해 clearTimeout 사용
    clearTimeout(timerID);

    document.querySelector("#displayText").style.display = "flex";

    // 체력을 비교하여 누가 이겼는지 표시
    if (player.health === enemy.health)
        document.querySelector("#displayText").innerHTML = "무승부";
    else if (player.health > enemy.health)
        document.querySelector("#displayText").innerHTML = "1p 승리";
    else if (player.health < enemy.health)
        document.querySelector("#displayText").innerHTML = "2p 승리";

}

// 체력이 0이 되었을 때 타이머 멈추기
let timerID;

// 타이머 값 설정
let timer = 15;

// 시간 감소 함수
function decreaseTimer() {
    if (timer > 0) {

        // 재귀함수를 이용하여 1초마다 시간 감소
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    }

    // 시간이 0이 되면 승패 결정
    if (timer === 0) {
        determineWinner({ player, enemy, timerID })
    }
}

// 시간 감소 실행
decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    // console.log("go");

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    // 가만히 있었을 때 움직이지 않음
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // 키가 눌리고, 라스트키가 해당 키일때만 움직이는 if문
    if (keys.a.pressed && lastkey === "a") {
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && lastkey === "d") {
        player.velocity.x = 5;
    }

    if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
        enemy.velocity.x = -5;
    }
    else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
        enemy.velocity.x = 5;
    }

    // 공격 조건을 함수로 변경
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking
    ) {
        console.log("hit");
        player.isAttacking = false;

        // 공격 판정시 체력 감소.
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + "%";


    }

    // 2p 공격도 추가
    // 공격 조건을 함수로 변경
    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking
    ) {
        console.log("enemy attack");
        enemy.isAttacking = false;

        // 체력 감소를 위한 코드. enemy를 전부 player로 변경해준다.
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + "%";
    }

    // 체력 감소 후 체력이 0이 되면 승패 결정
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }

}

animate();

// 키보드를 눌렀을 때, 이벤트 발생
window.addEventListener("keydown", (event) => {

    console.log(event.key);

    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            lastkey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            lastkey = "a";
            break;
        // 점프 추가
        case "w":
            player.velocity.y = -20;
            break;
        // 공격 키 추가
        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = "ArrowLeft";
            break;
        // 점프 추가
        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
        // 2p 공격 추가
        case "ArrowDown":
            enemy.attack();
            break;

    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
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


    }
})