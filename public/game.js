var canvas;
var x=0,y=0;
var bombs = [];
var players = [];
function mouseMove(e){
	x = e.clientX - canvas.offsetLeft;
	y = e.clientY - canvas.offsetTop;
	document.body.style.cursor = 'none';
	node_send({cursorPosition: { x: x, y: y}});
}
function redraw(){
	var context = canvas.getContext('2d');
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0,0,canvas.width,canvas.height);
	//draw players
	context.fillStyle = "rgb(50,150,0)";
	players.forEach(function(player){
		context.fillRect(player.x-10,player.y-10,20,20);
	});
	//draw bombs
	context.fillStyle = "rgb(100,0,0)";
	bombs.forEach(function(bomb){
		context.beginPath();
		context.arc(bomb.x,bomb.y,bomb.size,0,Math.PI*2,true);
		context.closePath();
		context.stroke();
		context.fill();
	});
	var t = setTimeout(redraw, 40);
}

function mouseClick(e){
	node_send({setBomb: { x: x, y: y}});
}
function init(){
	canvas = document.getElementById('tutorial');
	canvas.addEventListener("mousemove",mouseMove,false);
	canvas.addEventListener("mousedown",mouseClick,false);
	redraw();
}