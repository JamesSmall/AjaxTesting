"use strict";
var stackPanel;
var queuePanel;
var SINGLE_NODE = '{"data":null, "next":null}'
var queue = {
	"head":null,
	"tail":null,
	"add":function(item){
		var newNode = JSON.parse(SINGLE_NODE);
		newNode.data = item;
		if(queue.head === null){
			queue.head = newNode;
			queue.tail = newNode;
		}
		else{
			//newNode.next = queue.head;
			queue.tail.next = newNode;
			queue.tail = newNode;
		}
		queue.refreshRender();
	},
	"remove":function(){
		if(queue.tail === null){
			//does not exist
		}
		else if(queue.head.next === null){
			queue.tail = null;
			queue.head = null;
		}
		else{
			queue.head = queue.head.next;
		}
		queue.refreshRender();
	},
	"refreshRender":function(){
		var obj = queue.head;
		var renderArray = new Array();
		for(var i = 0; i < 8 && obj!=null;i++){
			renderArray.push(obj.data);
			obj = obj.next;
		}
		if(obj !== null){
			renderArray.push("...");
		}
		queuePanel.width = queuePanel.width;
		var blockWidth = queuePanel.width/11;
		var context = queuePanel.getContext("2d");

		for(var i = 0; i < renderArray.length;i++){
			context.fillStyle ="#ff0000";
			context.fillRect((blockWidth*1.2)*(i),stackPanel.height/2-150,(blockWidth),300);
			context.font = "200px Arial";
			context.fillStyle = "#000000";
			context.fillText(renderArray[i].substring(0,4),(blockWidth*1.2)*(i),stackPanel.height/2+60);
		}
	}
}
var stack = {
	"head":null,
	"add":function(item){
		var newNode = JSON.parse(SINGLE_NODE);
		newNode.data = item;
		if(stack.head===null){
			stack.head = newNode;
		}
		else{
			newNode.next = stack.head;
			stack.head = newNode;
		}
		stack.refreshRender();
	},
	"remove":function(){
		if(stack.head!==null){
			stack.head = stack.head.next;
			stack.refreshRender();
		}
	},
	"refreshRender":function(){
		var obj = stack.head;
		var renderArray = new Array();
		for(var i = 0; i < 8 && obj!=null;i++){
			renderArray.push(obj.data);
			obj = obj.next;
		}
		if(obj !== null){
			renderArray.push("...");
		}
		stackPanel.width = stackPanel.width;
		var blockWidth = stackPanel.width/11;
		var context = stackPanel.getContext("2d");

		for(var i = 0; i < renderArray.length;i++){
			context.fillStyle ="#ff0000";
			context.fillRect((blockWidth*1.2)*(i),stackPanel.height/2-150,(blockWidth),300);
			context.font = "200px Arial";
			context.fillStyle = "#000000";
			context.fillText(renderArray[i].substring(0,4),(blockWidth*1.2)*(i),stackPanel.height/2+60);
		}
	}
}

/*
	Queues

*/
function setupQueue(){
	queuePanel = document.getElementById("QueueExample");
	if(queuePanel.addEventListener){
		queuePanel.addEventListener("resize",queue.refreshRender,false);
	}
	else if(queuePanel.attachEvent){
		queuePanel.attachEvent("onresize",queue.refreshRender);
	}
	queue.refreshRender();
}
function queueRemove(){
	queue.remove();
}
function queueAdd(){
	var value = document.getElementById("QueueInput").value;
	queue.add(value);
}
/*
	Stacks
	
*/
function setupStack(){
	stackPanel = document.getElementById("StackExample");
	if(stackPanel.addEventListener){
		stackPanel.addEventListener("resize",stack.refreshRender,false);
	}
	else if(stackPanel.attachEvent){
		stackPanel.attachEvent("onresize",stack.refreshRender);
	}
	stack.refreshRender();
}
function stackRemove(){
	stack.remove();
}
function stackAdd(){
	var value = document.getElementById("stackInput").value;
	stack.add(value);
}
