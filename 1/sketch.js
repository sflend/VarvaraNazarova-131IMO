/*

The Game Project

1 - Background Scenery

Use p5 drawing functions such as rect, ellipse, line, triangle and
point to draw the scenery as set out in the code comments. The items
should appear next to the text titles.

Each bit of scenery is worth two marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = you've used several shape functions to create the scenery

I've given titles and chosen some base colours, but feel free to
imaginatively modify these and interpret the scenery titles loosely to
match your game theme.


WARNING: Do not get too carried away. If you're shape takes more than 5 lines
of code to draw then you've probably over done it.


*/

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

	//1. a cloud in the sky
	stroke(255, 255, 255)
	strokeWeight(60)
	point(230, 100)
	point(260, 100)
	point(200, 100)
	point(230, 120)
	point(245, 89)
	point(195, 110)//... add your code here

	noStroke();
	fill(255);
	text("cloud", 230, 100);

	//2. a mountain in the distance
	fill(80, 80, 110)
	triangle(733, 433, 370, 433, 500, 80)//... add your code here

	noStroke();
	fill(255);
	text("mountain", 500, 256);

	//3. a tree
	stroke(88, 57, 39)
	strokeWeight(10)
	line(810, 428, 810, 390)
	stroke(1, 50, 20)
	strokeWeight(25)
	triangle(800, 390, 810, 380, 820, 390)
	strokeWeight(20)
	triangle(800, 370, 810, 360, 820, 370)
	strokeWeight(15)
	triangle(800, 350, 810, 340, 820, 350)//... add your code here

	noStroke();
	fill(255);
	text("tree", 800, 346);

	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen

	stroke(88, 57, 39)
	strokeWeight(30)
	line(156, 443, -120, 700)//... add your code here

	noStroke();
	fill(255);
	text("canyon", 100, 480);

	//5. a collectable token - eg. a jewel, fruit, coins
	stroke(240, 240, 0)
	strokeWeight(45)
	point(440, 395)
	stroke(172, 170, 20)
	strokeWeight(20)
	point(440, 395)//... add your code here

	noStroke();
	fill(255);
	text("collectable item", 400, 400);
}
