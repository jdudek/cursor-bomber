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
	context.fillStyle = "rgb(100,0,0)";
	for(var i=0;i<bombs.length;i++){
		var bomb = bombs[i];
		var nX = bomb[0] - bomb[2]/2;
		var nY = bomb[1] - bomb[2]/2;
		context.fillRect(nX,nY,bomb[2],bomb[2]);
	}
	context.fillStyle = "rgb(50,150,0)";
	players.forEach(function(player){
		context.fillRect(player.x,player.y,20,20);
	});
	var t = setTimeout(redraw, 40);
}

function grow(i){
	bombs[i][2] += 1;
	if(bombs[i][2] < 90){
		var t = setTimeout("grow("+i+")",100);
	}
}
function mouseClick(e){
	bombs.push([x,y,20]);
	grow(bombs.length-1);
	node_send({setBomb: { x: x, y: y}});
}
function init(){
	canvas = document.getElementById('tutorial');
	canvas.addEventListener("mousemove",mouseMove,false);
	canvas.addEventListener("mousedown",mouseClick,false);
	redraw();
}