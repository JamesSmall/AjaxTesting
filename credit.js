"use strict";

function exit(){
	window.parent.close();
}

function addEvents(){
	var btn = document.getElementById('exit');
	if(btn.addEventListener){
		btn.addEventListener("click",exit,false);
	}
	else if(btn.attachEvent){
		btn.attachEvent("onclick",exit);
	}
}
if(window.addEventListener){
	window.addEventListener("load",addEvents,false);
}
else if(window.attachEvent){
	window.attachEvent("onload",addEvents);
}