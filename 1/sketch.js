let gameCharHead = {
	gameChar_x: 560,
	gameChar_y: 360
};


let gameCharBody = {
	gameChar_x: 550,
	gameChar_x2: 420,
	gameChar_y: 560,
	gameChar_y2: 400,
	gameChar_z: 570,
	gameChar_z2: 420
};

function setup()
{
	createCanvas(1024, 576);
}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, 432, 1024, 144); //draw some green ground

	//cloud
	stroke(255, 255, 255);
	strokeWeight(60);
	point(230, 100);
	point(260, 100);
	point(200, 100);
	point(230, 120);
	point(245, 89);
	point(195, 110);



	//mountain
	noStroke();
	fill(80, 80, 110);
	triangle(733, 433, 370, 433, 500, 80);



	//a tree
	stroke(88, 57, 39);
	strokeWeight(10);
	line(810, 428, 810, 390);
	stroke(1, 50, 20);
	strokeWeight(25);
	triangle(800, 390, 810, 380, 820, 390);
	strokeWeight(20);
	triangle(800, 370, 810, 360, 820, 370);
	strokeWeight(15);
	triangle(800, 350, 810, 340, 820, 350);


	//canyon
	noStroke();
	fill(88, 57, 39);
	triangle(80, 600, 150, 430, 210, 600);
	fill(44, 44, 44);
	triangle(80, 770, 150, 430, 210, 770);


	//collectable coin
	stroke(240, 240, 0)
	strokeWeight(45)
	point(440, 395)
	stroke(172, 170, 20)
	strokeWeight(20)
	point(440, 395);

	
	//character (front)
	stroke(255, 250, 250);
	strokeWeight(30);
	point(gameCharHead.gameChar_x, gameCharHead.gameChar_y);
	fill(255, 255, 255);
	triangle(gameCharBody.gameChar_x, gameCharBody.gameChar_x2, gameCharBody.gameChar_y, gameCharBody.gameChar_y2, gameCharBody.gameChar_z, gameCharBody.gameChar_z2);


	//character (jumping)
	//stroke(255, 250, 250);
	//strokeWeight(30);
	//point(gameCharHead.gameChar_x, gameCharHead.gameChar_y - 60);
	//fill(255, 255, 255);
	//triangle(gameCharBody.gameChar_x, gameCharBody.gameChar_x2 - 60, gameCharBody.gameChar_y, gameCharBody.gameChar_y2 - 60, gameCharBody.gameChar_z, gameCharBody.gameChar_z2 - 60);


	//character (walking left)
	//stroke(255, 250, 250);
	//strokeWeight(30);
	//point(gameCharHead.gameChar_x - 65, gameCharHead.gameChar_y);
	//fill(255, 255, 255);
	//triangle(gameCharBody.gameChar_x - 65, gameCharBody.gameChar_x2, gameCharBody.gameChar_y - 65, gameCharBody.gameChar_y2, gameCharBody.gameChar_z - 65, gameCharBody.gameChar_z2);


	//character (walking right)
	//stroke(255, 250, 250);
	//strokeWeight(30);
	//point(gameCharHead.gameChar_x + 65, gameCharHead.gameChar_y);
	//fill(255, 255, 255);
	//triangle(gameCharBody.gameChar_x + 65, gameCharBody.gameChar_x2, gameCharBody.gameChar_y + 65, gameCharBody.gameChar_y2, gameCharBody.gameChar_z + 65, gameCharBody.gameChar_z2);


	//character (jumping left)
	//stroke(255, 250, 250);
	//strokeWeight(30);
	//point(gameCharHead.gameChar_x - 65, gameCharHead.gameChar_y - 60);
	//fill(255, 255, 255);
	//triangle(gameCharBody.gameChar_x - 65, gameCharBody.gameChar_x2 - 60, gameCharBody.gameChar_y - 65, gameCharBody.gameChar_y2 - 60, gameCharBody.gameChar_z - 65, gameCharBody.gameChar_z2 - 60);


	//character (jumping right)
	//stroke(255, 250, 250);
	//strokeWeight(30);
	//point(gameCharHead.gameChar_x + 65, gameCharHead.gameChar_y - 60);
	//fill(255, 255, 255);
	//triangle(gameCharBody.gameChar_x + 65, gameCharBody.gameChar_x2 - 60, gameCharBody.gameChar_y + 65, gameCharBody.gameChar_y2 - 60, gameCharBody.gameChar_z + 65, gameCharBody.gameChar_z2 - 60);




}
