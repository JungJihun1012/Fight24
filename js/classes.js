class Sprite {
    constructor({ position, imageSrc}) {
        this.position = position;
        this.width = 50;
        this.height = 150;

        this.image = new Image();
        this.image.src = imageSrc; 

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.draw();
    }
}

class Fighter {
    constructor({ position, velocity, color = "red", offset }) {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;

        this.lastkey;

        // 공격 범위 박스
        this.attackBox = {
            // position : this.position,
            width: 100,
            height: 50,
            // 박스 위치 변경
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            // 어택박스 기준점 설정
            offset,
        };

        // 캐릭터 색상 지정
        this.color = color;

        // 캐릭터 공격 판정
        this.isAttacking;

        // 체력 추가
        this.health = 100;

    }

    draw() {
        // 캐릭터 색 구분하기
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // 00 공격 버튼 누를시에 공격 판정 그리기
        if (this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height,
            );
        }

    }

    update() {
        this.draw();

        // 어택박스의 위치를 지정
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
        // 공격 딜레이 걸기
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}