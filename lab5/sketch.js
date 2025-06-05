var deathAudio = new Audio('assets/sound/death_sound.mp3');
var attackAudio = new Audio('assets/sound/attackSound.mp3');
let soundOn;
let soundOff;
let backgroundMusic;
let music;
let isGameOver = false;
let deathScreenImg;
let restartButton;
let color_slider;

// Камера
let scrollX = 0;
let scrollMargin = 200; // Отступ от края где прокрутка
let worldWidth = 2048; // Ширина мира

let gameObj = {
    Untouch: [], // земля и каньоны
    Castles: [
        new Castle(750, 450, 500, 300),
        new Castle(650, 550, 400, 350),
        new Castle(1500, 450, 500, 300),
    ],
    Clouds: [],
    CollectableItem: [],
    Platforms: [],
    Enemy: [],
    Character: null
}

let canyonCount = 5; // Кол во каньонов
let itemAmount = 10; // Кол во предметов
let platformAmount = 5; // Кол во платформ
let enemyAmount = 5; // Кол во врагов
let cloudAmount = 10; // Кол во облаков


function preload() {
    soundOn = loadImage('/assets/image/soundOn.jpeg');
    soundOff = loadImage('/assets/image/soundOff.jpeg');
    deathScreenImg = loadImage('/assets/image/deathScreen.png');
    backgroundMusic = loadSound('/assets/sound/background_music.mp3');
    music = true;
}

function setup() {
    createCanvas(1024, 476);
    backgroundMusic.loop();
    drawSlider();

    // Генерация земли и каньонов
    gameObj.Untouch.push(new Ground(0, 350, worldWidth, 200));
    generateCanyons();
    generatePlatforms();
    generateCollectableItems();
    generateEnemies();
    generateClouds();

    // Создаем персонажа после генерации платформ и каньонов
    gameObj.Character = new Character(50, 350, 60, 4, 50, 325, 60, 5, true);
}

function draw() {
    updateCamera();

    // Градиентный фон
    for (let i = 0; i <= height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color(135, 206, 235), color(255, 204, 0), inter);
        stroke(c);
        line(0, i, width, i);
    }

    if (isGameOver) {
        drawDeathScreen();
        return;
    }

    let volume = color_slider.value() / 255;
    backgroundMusic.setVolume(volume);
    attackAudio.volume = volume;
    deathAudio.volume = volume;

    push();
    translate(-scrollX, 0);

    fill(255, 204, 0);
    noStroke();
    ellipse(800, 100, 80, 80);

    fill(34, 139, 34);
    rect(0, 350, worldWidth, height - 350);

    gameObj.Untouch.forEach(obj => obj.draw());
    gameObj.Castles.forEach(castle => castle.draw());
    gameObj.Clouds.forEach(cloud => {
        cloud.draw();
        cloud.move();
    });
    gameObj.CollectableItem.forEach(item => {
        item.draw();
        item.collection();
    });
    gameObj.Platforms.forEach(platform => platform.draw());
    gameObj.Character.draw();
    gameObj.Character.move();
    gameObj.Enemy.forEach(enemy => {
        enemy.draw();
        enemy.death();
    });

    pop();
}

function updateCamera() {
    let characterX = gameObj.Character.x;
    if (characterX > scrollX + width - scrollMargin) {
        scrollX = characterX - (width - scrollMargin);
    }
    if (characterX < scrollX + scrollMargin) {
        scrollX = characterX - scrollMargin;
    }
    scrollX = constrain(scrollX, 0, worldWidth - width);
}

function drawDeathScreen() {
    image(deathScreenImg, width / 2 - deathScreenImg.width / 2, height / 2 - deathScreenImg.height / 2);
    if (!restartButton) {
        restartButton = createButton('restart');
        restartButton.position(width / 2 - 40, height / 2 + deathScreenImg.height / 2 + 10);
        restartButton.mousePressed(respawn);
    }
}

function respawn() {
    gameObj.Character.respawn();
    gameObj.CollectableItem.forEach(item => item.respawn());
    gameObj.Enemy.forEach(enemy => enemy.respawn());
    isGameOver = false;
    if (restartButton) {
        restartButton.remove();
        restartButton = null;
    }
}

function drawSlider() {
    color_slider = createSlider(0, 255, 125);
    color_slider.position(50, 10);
}

function keyPressed() {
    if (!music && keyIsDown(82)) { // R
        backgroundMusic.volume = 0.1;
        attackAudio.volume = 0.5;
        deathAudio.volume = 0.5;
        backgroundMusic.play();
        music = true;
    } else if (music && keyIsDown(82)) {
        backgroundMusic.volume = 0;
        attackAudio.volume = 0;
        deathAudio.volume = 0;
        backgroundMusic.stop();
        music = false;
    }
}

function drawSound() {
    if (!music)
        image(soundOff, 0, 0, 20, 20);
    else
        image(soundOn, 0, 0, 20, 20);
}


function generateCanyons() {
    let canyonSpacing = worldWidth / (canyonCount + 1);
    for (let i = 1; i <= canyonCount; i++) {
        let x = i * canyonSpacing + random(-canyonSpacing / 4, canyonSpacing / 4);
        let canyonWidth = random(50, 150);
        gameObj.Untouch.push(new Canyon(x, 350, canyonWidth, 500));
    }
}

function generatePlatforms() {
    gameObj.Untouch.forEach(obj => {
        if (obj instanceof Canyon) {
            let platformX = obj.x + obj.widh / 2 - 100;
            let platformY = 300;
            let platformWidth = random(100, 200);
            gameObj.Platforms.push(new Platform(platformX, platformY, platformWidth, 20));
        }
    });
}

function generateCollectableItems() {
    let maxAttempts = 1000;
    for (let i = 0; i < itemAmount; i++) {
        let attempts = 0;
        let validPosition = false;
        let x, y;

        while (!validPosition && attempts < maxAttempts) {
            attempts++;
            x = random(50, worldWidth - 50);
            y = random(100, 320);

            validPosition = true;

            // Проверка пересечений с другими предметами
            for (let j = 0; j < gameObj.CollectableItem.length; j++) {
                let otherItem = gameObj.CollectableItem[j];
                let distance = dist(x, y, otherItem.x, otherItem.y);
                if (distance < 50) {
                    validPosition = false;
                    break;
                }
            }

            // Проверка над каньонами
            gameObj.Untouch.forEach(untouch => {
                if (untouch instanceof Canyon && x > untouch.x && x < untouch.x + untouch.widh && y > untouch.y) {
                    validPosition = false;
                }
            });
        }

        if (validPosition) {
            gameObj.CollectableItem.push(new Item(x, y, 20));
        } else {
            console.warn(`Не удалось найти позицию для предмета ${i} после ${maxAttempts} попыток.`);
        }
    }
}

function generateEnemies() {
    gameObj.Platforms.forEach(platform => {
        let enemyX = platform.x + platform.w / 2;
        let enemyY = platform.y;
        gameObj.Enemy.push(new Enemy(enemyX, enemyY, 20, 10));
    });
}

function generateClouds() {
    for (let i = 0; i < cloudAmount; i++) {
        let x = random(0, worldWidth);
        let y = random(50, 150);
        let radius = random(50, 100);
        let speed = random(0.5, 1.5);
        gameObj.Clouds.push(new Cloud(x, y, radius, speed));
    }
}


function Castle(x1, y, width, height) {
    this.x1 = x1;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function() {
        fill("black");
        rect(this.x1, this.y - this.height, this.width, this.height);

        fill("black");
        rect(this.x1 + 30, this.y - this.height - 50, 30, 50);
        rect(this.x1 + this.width - 60, this.y - this.height - 50, 30, 50);

        fill("black");
        triangle(this.x1, this.y - this.height, this.x1 + 30, this.y - this.height - 50, this.x1 + 60, this.y - this.height);

        fill("black");
        for (let i = 0; i < 5; i++) {
            rect(this.x1 + (i * 20) + 5, this.y - this.height - 10, 10, 10);
        }
    }
}

function Ground(cordX, cordY, width, length) {
    this.x = cordX;
    this.y = cordY;
    this.width = width;
    this.length = length;

    this.draw = function() {
        noStroke();
        fill("black");
        rect(this.x, this.y, this.width, this.length);
    }
}

function Canyon(cordX, cordY, widh, lengh) {
    this.x = cordX;
    this.y = cordY;
    this.widh = widh;
    this.lengh = lengh;

    this.draw = function() {
        fill("red");
        rect(this.x, this.y, this.widh, this.lengh);
    }

    this.isColliding = function(character) {
        return (
            character.x + character.r / 2 > this.x &&
            character.x - character.r / 2 < this.x + this.widh &&
            character.y + character.r > this.y &&
            character.y - character.r < this.y + this.lengh
        );
    };
}

function Cloud(cordX, cordY, radius, speedMove) {
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = speedMove;

    this.draw = function() {
        strokeWeight(3);
        stroke("silver");
        fill("gray");
        ellipse(this.x, this.y - this.r / 4, this.r / 2);
        ellipse(this.x, this.y, this.r, this.r / 2);
        noStroke();
        ellipse(this.x, this.y - this.r / 4, this.r / 2 - 5);
    };

    this.move = function() {
        if ((this.x - this.r) < worldWidth)
            this.x += this.s;
        else
            this.x = (4 - this.r);
    }
}

function Item(cordX, cordY, radius) {
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.active = true;

    this.draw = function() {
        if (this.active) {
            strokeWeight(3);
            stroke("yellow");
            fill("gold");
            circle(this.x, this.y, this.r);
        }
    };

    this.collection = function() {
        if (this.active && gameObj.Character.x > this.x && gameObj.Character.y > this.y) {
            this.active = false;
            this.x = -100;
            this.y = -100;
        }
    };

    this.respawn = function() {
        this.active = true;
    };
}

function Platform(cordX, cordY, width, length) {
    this.x = cordX;
    this.y = cordY;
    this.w = width;
    this.length = length;

    this.draw = function() {
        strokeWeight(3);
        stroke('green');
        fill("green");
        rect(this.x, this.y, this.w, this.length);
    }
}

function Enemy(cordX, cordY, width, height) {
    this.x = cordX;
    this.y = cordY;
    this.w = width;
    this.h = height;
    this.enemyDefeated = false;

    this.draw = function() {
        strokeWeight(1);
        stroke(0);
        noStroke();
        fill("red");
        rect(this.x - this.w / 2, this.y - this.h, this.w, this.h * 2);
        fill("peachpuff");
        circle(this.x, this.y - this.h - 5, this.w);
        fill("red");
        arc(this.x, this.y - this.h - 5, this.w + 10, this.w + 10, PI, 0, CHORD);
    };

    this.death = function() {
        if ((gameObj.Character.x + 65) > this.x && gameObj.Character.enemyAttackState === true && (gameObj.Character.y - 65) < this.y) {
            this.y = -100;
            this.enemyDefeated = true;
        }
    };

    this.respawn = function() {
        this.y = cordY;
        this.enemyDefeated = false;
    };
}

function Character(cordX, cordY, radius, moveSpeed, constX, constY, constRadius, jumpSpeed, someFlag) {
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = moveSpeed;
    this.constX = constX;
    this.constY = constY;
    this.constR = constRadius;
    this.jumpSpeed = jumpSpeed;
    this.jumping = false;
    this.enemyAttackState = false;

    this.isCollidingWPlatform = function(platform) {
        return (
            this.x + this.r / 2 > platform.x &&
            this.x - this.r / 2 < platform.x + platform.w &&
            this.y + this.r >= platform.y &&
            this.y < platform.y + platform.length
        );
    };

    this.draw = function() {
        strokeWeight(1);
        stroke(0);
        noStroke();
        fill("gray");
        rect(this.x - this.r / 2, this.y - this.r, this.r, this.r * 2);
        fill("peachpuff");
        circle(this.x, this.y - this.r - 15, this.r);
        fill("gray");
        arc(this.x, this.y - this.r - 15, this.r + 10, this.r + 10, PI, 0, CHORD);
    };

    this.move = function() {
        let isOverCanyon = false;

        gameObj.Untouch.forEach(obj => {
            if (obj instanceof Canyon && obj.isColliding(this)) {
                isOverCanyon = true;
            }
        });

        let isOnPlatform = false;
        for (let i = 0; i < gameObj.Platforms.length; i++) {
            let platform = gameObj.Platforms[i];
            if (this.isCollidingWPlatform(platform)) {
                isOnPlatform = true;
                break;
            }
        }

        if (isOverCanyon && !isOnPlatform) {
            if (this.y < 500) {
                this.dead();
                this.y += 6;
            } else {
                this.respawn();
            }
        } else if (580 < this.x && gameObj.Enemy.enemyDefeated == false) {
            this.respawn();
        } else {
            if (keyIsDown(68)) this.moveRight();
            if (keyIsDown(65)) this.moveLeft();
            if (keyIsDown(32) && !this.jumping) {
                this.jump();
                this.jumping = true;
            }

            if (keyIsDown(70)) {
                this.EnemyAttack();
            } else {
                this.enemyAttackState = false;
            }

            this.grounded();

            for (let i = 0; i < gameObj.Platforms.length; i++) {
                let platform = gameObj.Platforms[i];
                if (this.isCollidingWPlatform(platform) && this.jumpSpeed >= 0) {
                    this.y = platform.y - this.r;
                    this.jumpSpeed = 0;
                    this.jumping = false;
                    break;
                }
            }

            if (this.y >= this.constY) {
                this.jumping = false;
            }
        }
    };

    this.moveLeft = function() {
        if (this.x > 0 && !keyIsDown(68)) {
            this.x -= this.s;
            stroke('gray');
            strokeWeight(5);
            line(this.x + this.r / 2 - 55, this.y - this.r, this.x + this.r - 120, this.y - this.r - 30);
        }
    };

    this.moveRight = function() {
        if (this.x < worldWidth && !keyIsDown(65)) {
            this.x += this.s;
            stroke('gray');
            strokeWeight(5);
            line(this.x + this.r / 2, this.y - this.r, this.x + this.r, this.y - this.r - 30);
        }
    };

    this.jump = function() {
        if (this.y > 100) {
            this.jumpSpeed = -10;
            this.y += this.jumpSpeed;
        }
    };

    this.grounded = function() {
        this.jumpSpeed += 0.5;
        this.y += this.jumpSpeed;

        if (this.jumpSpeed > 10) {
            this.jumpSpeed = 10;
        }

        if (this.y > this.constY) {
            this.y = this.constY;
            this.jumpSpeed = 0;
            this.jumping = false;
        } else if (this.y < this.constY) {
            this.jumping = true;
        }
    };

    this.respawn = function() {
        this.x = this.constX;
        this.y = this.constY;
        this.r = this.constR;
    };

    this.dead = function() {
        noStroke();
        fill("#4da3ff");
        rect(this.x + 8.5, this.y - 63, 3, 10);
        rect(this.x - 11.5, this.y - 63, 3, 10);
        deathAudio.play();
        isGameOver = true;
    };

    this.EnemyAttack = function() {
        this.enemyAttackState = true;
        attackAudio.play();
    };
}
