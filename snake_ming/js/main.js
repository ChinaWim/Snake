 var bodywidth = 15;
 var mapwidth = 450;
 var mapheight = 450;
 var bodycolor = "green";
 var headcolor = "red";
 var  body = [ [1,0,headcolor],[0,0,bodycolor]];
 var scoretext = document.getElementById("scoretext");
 var socretitle = document.getElementById("scoretitle");
 var moveid = 0;
 var eatid = 0;
 var movetime = 200;
 var keycodes = new Array();
//地图和蛇身画布
 var cvs =document.getElementById("cvs");
 var ctx = cvs.getContext("2d");
 var direct = "right";
 var foodx = 0;
 var foody = 0;
 //标记值
 var isstop = false;
 var haveborder = true;
 var isborderpro = true;
 var isover = false; 
//食物图布
var foodcvs = document.getElementById("foodcvs");
var foodctx = foodcvs.getContext("2d");
function map (){
	ctx.strokeStyle = "azure";
	for (var i = 0 ;i <= 30 ;i ++){
		ctx.beginPath();
		ctx.moveTo(bodywidth*i,0);
		ctx.lineTo(bodywidth*i,mapheight);
		ctx.moveTo(0,bodywidth*i);
		ctx.lineTo(mapwidth,bodywidth*i);
		ctx.closePath();
		ctx.stroke();
	}
}
function snake(){
	ctx.beginPath();
	for (var i = 0;i< body.length; i++) {
		ctx.fillStyle = body[i][2];
		ctx.fillRect(body[i][0]*15, body[i][1]*15, bodywidth, bodywidth);
	}
		ctx.closePath();
		ctx.fill();

		
}
function food(){
	foodctx.fillStyle="yellow";
	this.show = function(){
		foodctx.beginPath();
		foodx = Math.floor(Math.random()*30);
		foody = Math.floor(Math.random()*30);
		foodctx.fillRect(foodx*15, foody*15 , bodywidth, bodywidth);
		foodctx.closePath();
		foodctx.fill();
	}
}
function move(){
	//把每一节都设置 为上一个地址，达到移动效果
	for (var i = body.length-1; i > 0; i --) {
		body[i][0] = body[i-1][0];
		body[i][1] = body[i-1][1];
	}
	//移动头
		switch(direct){
		case "right" :{
			if(body[0][0] == 29 && !haveborder ){
				body[0][0] =  0;
			}else
			body[0][0] ++;
			break;
		}
		case "left" :{
			if(body[0][0] ==  0 && !haveborder){
				body[0][0] =  29;
			}else
			body[0][0] --;
			break;
		}
		case "up":{
			if(body[0][1] == 0 && !haveborder){
				body[0][1] =  29;
			}else
			body[0][1] --;
			break;
		}
		case "down":{
			if(body[0][1] == 29 && !haveborder){
				body[0][1] =  0;
			}else
			body[0][1] ++;
			break;
		}
	  }
	  
	if ( die() == false ){
		ctx.clearRect(0,0,mapwidth,mapheight);
		if(haveborder)
		 map();
		snake();
	}
	die();
}
function setDirect(code){
	switch (code){
		case 37:{
			if(direct != "right")
			direct = "left";
			break;
		}
		case 38: {
			if(direct != "down")
			direct = "up";
			break;
		}
		case 39:{
 			if(direct != "left")
			direct = "right";
			break;
		}
		case 40:{
			if(direct != "up")
			direct = "down";
			break;
		}
		default:{
			stop();
			break;
		}
	}
}

function eat(){
	var f = new food();
	if(body[0][0] == foodx && body[0][1] == foody){
		var gameaudio = document.getElementById("gameEatAudio");

 		gameaudio.play();
 		
		body.push([0,0,bodycolor,null]);//添加尾巴的设置在地图外 防显示bug
		foodctx.clearRect(0,0,mapwidth,mapheight);
		scoretext.innerHTML =  10+parseInt(scoretext.innerHTML);   
		f.show();
	}
	maxscore();	
}
function over(){
	var gamestartaudio = document.getElementById("gameStartAudio");
	gamestartaudio.pause();
	gamestartaudio.currentTime = 0;
	
	var gameaudio = document.getElementById("gameOverAudio");
 	gameaudio.play();
	isover = true;
	clearInterval(moveid);	
	socretitle.innerHTML = "";
	scoretext.innerHTML = "GAME OVER  ";
}
function die(){
	if( body[0][0] < 0 || body[0][1] < 0 || body[0][1]*15 >= mapheight || body[0][0]*15 >= mapwidth){
		if( !haveborder ){
			return false;
		}else {
			over();
			return true;
		}
	}else {
		for(var i = 1 ;i < body.length; i++){
			if( (body[i][0] == body[0][0]) && (body[i][1] == body[0][1]) ){
				over();
				return true;
			}
		}
	}
 	return false;
}
function newgame(){
	var gamestartaudio = document.getElementById("gameStartAudio");
	gamestartaudio.play();
	isover = false;
	isstop = false;
	stoptext.innerHTML ="STOP GAME";
	socretitle.innerHTML = "Score:";
	scoretext.innerHTML = "0";   
	ctx.clearRect(0,0,mapwidth,mapheight);
	foodctx.clearRect(0,0,mapwidth,mapheight);
	clearInterval(moveid);	
	if(haveborder)
	map ();
	var f = new food();
	f.show();
	body = [ [1,0,headcolor],[0,0,bodycolor]];
	direct = "right";
	snake();
	moveid = setInterval("move()",movetime);
}
function stop(){
	if( isover) return ;
	var stoptext = document.getElementById("stoptext");
	if( moveid !=0  ){
		if( !isstop ){
		clearInterval(moveid);		
		isstop = true;
		stoptext.innerHTML ="CONTINUE GAME";
		}else {
			moveid = setInterval("move()",movetime);
			isstop = false;
			stoptext.innerHTML = "STOP GAME";
		}
	}	
}
function change(){
	if(isborderpro){
		haveborder = true;
	}else {
		haveborder = false;
	}
	newgame();
}
function setdifficult(){
	var level = document.getElementById("difficult").value;
	movetime = parseInt(level);
}
function setgeneral(){
	var level = document.getElementById("general").value;
	movetime = parseInt(level);
}
function setnood(){
	var level = document.getElementById("nood").value;
	movetime = parseInt(level);
}
function setborder(){
	isborderpro = true;
}
function clearborder(){
	isborderpro = false;
}
function maxscore(){
	var maxscore = document.getElementById("maxtext");
	var num = parseInt(scoretext.innerHTML);
	if(num != null){
		if( parseInt(scoretext.innerHTML) > parseInt(maxscore.innerHTML)){
		maxscore.innerHTML = scoretext.innerHTML;
		}
	}
}
document.onkeydown = function(event){
	 var code ;
	 if(window.event){
	 	code = event.keyCode
	 }else{
	 	code = event.which;
	 }
	 setDirect(code);
}
window.onload = function (){
	if(haveborder)
	map ();
	var f = new food();
	f.show();
	snake();
	moveid = setInterval("move()",movetime);
	eatid = setInterval("eat()",1);
}
