var backgroundMusic = new Audio('assets/sound/background_music.mp3');
var deathAudio = new Audio('assets/sound/death_sound.mp3')
let gameObj = {
    
    Untouch: [
        new ground(0, 350, 1024, 200),
        new canyon(180, 350, 140, 500),
    ],

    Castles: [
        new castle(750, 450, 500, 300),
        new castle(650, 550, 400, 350),
    ],

    Clouds: [
        new cloud(200, 120, 50, 1, 5),
        new cloud(600, 130, 70, 1, 5),
        new cloud(400, 50, 100, 1, 5),
        new cloud(900, 70, 110, 1, 5),
        new cloud(90, 65, 90, 1, 5),
        new cloud(800, 115, 95, 1, 5),
        new cloud(40, 95, 105, 1, 5)
    ],

    CollectableItem: [
        new item(500, 320, 40),
        new item(250, 200, 40)
    ],

    Enemy: [
        new enemy(600, 350, 20, 10),
    ],

    Character: new character(50, 325, 60, 4, 50, 325, 60, 5, true)
}

function setup() {
    createCanvas(1024, 476);
}

function draw() {
    //gradient background
    for (let i = 0; i <= height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color(135, 206, 235), color(255, 204, 0), inter);
        stroke(c);
        line(0, i, width, i);
    }

    //sun
    fill(255, 204, 0);
    noStroke();
    ellipse(800, 100, 80, 80);

    //ground
    fill(34, 139, 34);
    rect(0, 350, width, height - 350);

    //game objects
    gameObj.Untouch.forEach(obj => obj.draw());
    gameObj.Castles.forEach(castle => castle.draw());
    gameObj.Clouds.forEach((cloud, ind) => (cloud.draw(), cloud.move()));
    gameObj.CollectableItem.forEach((item, ind) => (item.draw(), item.collection()));
    (character => (character.draw(), character.move()))(gameObj.Character);
    gameObj.Enemy.forEach((enemy, ind) => (enemy.draw(), enemy.death()));
}


function castle(x1, y, width, height) {
    this.x1 = x1;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function() {
        //castle
        fill("black");
        rect(this.x1, this.y - this.height, this.width, this.height);
        fill("black");
        rect(this.x1 + 30, this.y - this.height - 50, 30, 50);
        rect(this.x1 + this.width - 60, this.y - this.height - 50, 30, 50);
        fill("black");
        triangle(this.x1, this.y - this.height, this.x1 + 30, this.y - this.height - 50, this.x1 + 60, this.y - this.height);
        triangle(this.x1 + this.width - 30, this.y - this.height, this.x1 + this.width, this.y - this.height - 50, this.x1 + this.width - 60, this.y - this.height);
        fill("black");
        for (let i = 0; i < 5; i++) {
            rect(this.x1 + (i * 20) + 5, this.y - this.height - 10, 10, 10);
        }
    }

    return this;
}


function ground(cordX, cordY, width, length)
{
    this.x = cordX;
    this.y = cordY;
    this.width = width;
    this.length = length;
    
    this.draw = function() 
    {
        noStroke();
        fill("black");
        rect(this.x, this.y, this.width, this.length);    
    }
    
    return this;
}

function canyon(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.widh = widh;
    this.lengh = lengh;
    
    this.draw = function()
    {
        fill("red");
        rect(this.x, this.y, this.widh, this.lengh);
    }
    
    return this;
}

function cloud(cordX, cordY, radius, speedMove)
{
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = speedMove;
    
    this.draw = function() 
    {
        strokeWeight(3);
        stroke("silver");
        fill("gray");
        ellipse(this.x, this.y-this.r/4, this.r/2);
        ellipse(this.x, this.y, this.r, this.r/2);
        noStroke();
        ellipse(this.x, this.y-this.r/4, this.r/2-5);
    },
    
    this.move = function()
    {
        if ((this.x - this.r) < 1024)
            this.x += this.s;
        else
            this.x = (4-this.r); //bring cloud to the left corner
    }
    
    return this;
}

function item(cordX, cordY, raduis)
{
    this.x = cordX;
    this.y = cordY;
    this.r = raduis;
    
    this.draw = function()
    {
        strokeWeight(3);
        stroke("yellow");
        fill("gold");
        circle(this.x, this.y, this.r);
    }
    
    this.collection = function()
    {
        if (gameObj.Character.x > this.x && gameObj.Character.y > this.y)
        {
            this.x = -100;
            this.y = -100;
        }
    }
    
    return this;
}

function enemy(cordX, cordY, width, height) 
{    
    this.x = cordX;
    this.y = cordY;
    this.w = width;
    this.h = height;

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
},
    
this.death = function()
{
    if ((gameObj.Character.x+65) > this.x && gameObj.Character.rightEnemyAttackState == true && (gameObj.Character.y-65) < this.y)
    {
        this.y = -100;
        this.enemyDefeated = true;
    }
}
 
return this;

}

function character(cordX, cordY, radius, moveSpeed, constX, constY, constRadius, jumpSpeed) {
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = moveSpeed;
    this.constX = constX;
    this.constY = constY;
    this.constR = constRadius;
    this.jumpSpeed = jumpSpeed;
    this.jumping = false;
    this.rightEnemyAttackState = false;

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
        if (this.x > 195 && this.x < 305 && !this.jumping) {
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
            if (keyIsDown(32) && this.y == constY) {
                this.jump();
                this.jumping = true;
            }

            if (keyIsDown(70)) {
                if (keyIsDown(68)) this.rightEnemyAttack();
                else this.rightEnemyAttack();
            } else {
                this.rightEnemyAttackState = false;
            }

            this.grounded();
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
        if (this.x < 1024 && !keyIsDown(65)) {
            this.x += this.s;
            stroke('gray');
            strokeWeight(5);
            line(this.x + this.r / 2, this.y - this.r, this.x + this.r, this.y - this.r - 30);
        }
    };

    this.jump = function() {
        if (this.y > 100) {
            this.jumpSpeed = 8;
            this.y -= this.jumpSpeed;
        }
    };

    this.grounded = function() {
        if (this.y < this.constY) {
            this.jumpSpeed -= 0.5;
            this.y -= this.jumpSpeed; 
        }
        
        if (this.y == constY) this.jumping = false;
    };

    this.respawn = function() {
        this.x = this.constX;
        this.y = this.constY;
        this.r = this.constR;
    };

    this.dead = function()
    {
        noStroke();
        fill("#4da3ff");
        rect(this.x+8.5, this.y-63, 3, 10);
        rect(this.x-11.5, this.y-63, 3, 10);
        deathAudio.play();
    };
    
    this.rightEnemyAttack = function() 
    {
        this.rightEnemyAttackState = true;
    };

    return this;
}
