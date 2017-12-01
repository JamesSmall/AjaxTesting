"use strict";
//global declared values
var WIDTH_OF_BLOCK_PIXEL = 30;
var HEIGHT_OF_BLOCK_PIXEL = 10

var ArrayListPanel;
var LinkedListPanel;
var ArrayList = {
		"size":0,
		"items":new Array(9),
		"instant":true,
		"set":function(index,item){
			ArrayList.items[index] = item;
			ArrayList.refreshRender();
		},
		"add":function(item,index){
			if(index===undefined){
				index=ArrayList.size;
			}
			while(index <= ArrayList.size){
				var temp = ArrayList.items[index];
				ArrayList.items[index] = ""+item;
				item = temp;
				index++;

			}
			ArrayList.size++;
			ArrayList.refreshRender();

		},
		"remove":function(index){
			if(index < ArrayList.size){
				while(index < ArrayList.size-1){
					ArrayList.items[index] = ArrayList.items[index+1];
					index++;
				}
				ArrayList.items[index] = null;
				ArrayList.size--;
				ArrayList.refreshRender();
			}
		},
		"clear":function(){
			ArrayList.items = new Array(9);
			ArrayList.refreshRender();
		},
		"refreshRender":function(){
			//clean panel
			ArrayListPanel.width = ArrayListPanel.width;
			var blockWidth = ArrayListPanel.width/11;

			var context = ArrayListPanel.getContext("2d");

			//context.fillStyle = "#000000";
			//context.fillRect(0,ArrayListPanel.width,0,ArrayListPanel.height);
			for(var i = 0; i < ArrayList.items.length;i++){
				if(ArrayList.items[i] === null || ArrayList.items[i] === undefined){
					context.fillStyle ="#990000";
					context.fillRect((blockWidth*1.2)*(i),ArrayListPanel.height/2-150,(blockWidth),300);
					context.font = "200px Arial";
					context.fillStyle = "#000000";
					context.fillText("Null",(blockWidth*1.2)*(i),ArrayListPanel.height/2+60);
				}
				else{
					context.fillStyle ="#ff0000";
					context.fillRect((blockWidth*1.2)*(i),ArrayListPanel.height/2-150,(blockWidth),300);
					context.font = "200px Arial";
					context.fillStyle = "#000000";
					context.fillText(ArrayList.items[i].substring(0,4),(blockWidth*1.2)*(i),ArrayListPanel.height/2+60);
				}
			}
		}
	};

var NODE_TEMPLATE = '{"data": null,"next":null,"prev":null}';//use JSON.parse to convent to json object
var LinkedList = {
	"target":null,
	"addAtEnd":function(item){
		if(LinkedList.target !=null){
			var temp = LinkedList.target;
			while(temp.next !==null){
				temp = temp.next;
			}
			var newItem = JSON.parse(NODE_TEMPLATE);
			newItem.data = ""+item;
			newItem.prev = temp;

			temp.next = newItem;
			//LinkedList.target = newItem;
		}
		else{
			LinkedList.target = JSON.parse(NODE_TEMPLATE);
			LinkedList.target.data = ""+item;
		}
		LinkedList.refreshRender();
	},
	"setItem": function(item){
		if(LinkedList.target!==null){
			LinkedList.target.data = item;
			LinkedList.refreshRender();
		}
		else{
			//default case, create everything
			LinkedList.add(item);
		}
	},
	"add":function(item){
		var newItem = JSON.parse(NODE_TEMPLATE);
		newItem.data = ""+item;

		if(LinkedList.target!=null){
			newItem.next = LinkedList.target;
			newItem.prev = LinkedList.target.prev;
			if(LinkedList.target.prev!==null){
				LinkedList.target.prev.next = newItem;
			}
			LinkedList.target.prev = newItem;
			//LinkedList.target = newItem;
		}
		LinkedList.target = newItem;
		LinkedList.refreshRender();
	},
	"gotoIndex":function(index){
		if(LinkedList.target !==null){
			//go all the way left
			while(LinkedList.target.prev !=null){
				LinkedList.target = LinkedList.target.prev;
			}
			for(var i = 0; i < index && LinkedList.target.next!== null;i++){
				LinkedList.target = LinkedList.target.next;
			}
		}
		LinkedList.refreshRender();
	},
	"remove":function(){
		if(LinkedList.target !==null){

			if(LinkedList.target.next !==null){
				LinkedList.target.next.prev = LinkedList.target.prev;
				if(LinkedList.target.prev!==null){
					LinkedList.target.prev.next = LinkedList.target.next;
				}
				LinkedList.target = LinkedList.target.next;
			}
			else if(LinkedList.target.prev !== null){
				LinkedList.target = LinkedList.target.prev;
				LinkedList.target.next = null;
			}
			else{
				LinkedList.target = null;
			}
		}
		LinkedList.refreshRender();
	},
	"clear": function(){
		LinkedList.target = null;
		LinkedList.refreshRender();
	},
	"refreshRender": function(){
		var depthLeft = 0;
		var depthRight = 0;
		var currTarget = LinkedList.target;
		LinkedListPanel.width = LinkedListPanel.width;
		if(currTarget == null){
			//nothing to render, might as well leave
			return;
		}
		while(currTarget!=null){
			currTarget = currTarget.next;
			depthRight++;
		}
		currTarget = LinkedList.target;
		while(currTarget != null){
			currTarget = currTarget.prev;
			depthLeft++;
		}
		var renderArray = new Array();
		var targetIndex;
		if(depthLeft > 8 && depthRight > 8){
			renderArray[0] = "...";
			renderArray[8] = "...";
			renderArray[4] = LinkedList.target.data;
			targetIndex = 4;
			var left = LinkedList.target;
			var right = LinkedList.target;
			for(var i = 1; i < 4;i++){
				left = left.prev;
				right = right.next;

				renderArray[4-i] = left.data;
				renderArray[4+i] = right.data;
			}
		}
		else if(depthLeft > 8){
			//get target pos
			var findSize = LinkedList.target;
			targetIndex = 8;

			var index = LinkedList.target;
			//move far left to render properly
			while(index.next !== null){
				index = index.next;
				targetIndex--;
			}

			for(var i = 0; i < 8;i++){
				renderArray[8-i] = index.data;
				index = index.prev;
			}
			renderArray[0] = "...";
		}
		//9 elements, 4 on left, 5 on right
		else if(depthLeft+depthRight > 9){
			var index = LinkedList.target;
			targetIndex = 0;
			//move far left to render properly
			while(index.prev !== null){
				index = index.prev;
				targetIndex++;
			}
			for(var i = 0; i < 8;i++){
				renderArray.push(index.data);
				index = index.next;
			}
			renderArray.push("...");
			/*while(index !== null){
				renderArray.push(index.data);
				index = index.next;
			}*/
		}
		else{
			var index = LinkedList.target;
			targetIndex = 0;
			//move far left to render properly
			while(index.prev !== null){
				index = index.prev;
				targetIndex++;
			}

			while(index !== null){
				renderArray.push(index.data);
				index = index.next;
			}


		}

		LinkedListPanel.width = LinkedListPanel.width;
		var blockWidth = LinkedListPanel.width/11;
		var context = LinkedListPanel.getContext("2d");

		for(var i = 0; i < renderArray.length;i++){
			if(i === targetIndex){
				context.fillStyle = "#0000ff"
			}
			else{
				context.fillStyle ="#ff0000";
			}
			context.fillRect((blockWidth*1.2)*(i),LinkedListPanel.height/2-150,(blockWidth),300);
			context.font = "200px Arial";
			context.fillStyle = "#000000";
			context.fillText(renderArray[i].substring(0,4),(blockWidth*1.2)*(i),LinkedListPanel.height/2+60);
		}

	}
}
/*
	Array Elements
*/
function setupArrayList(){
	ArrayListPanel = document.getElementById('ArrayListExample');
	if(ArrayListPanel.addEventListener){
		ArrayListPanel.addEventListener("resize",function(){ArrayList.refreshRender();},false);
	}
	else if(ArrayListPanel.attachEvent){
		ArrayListPanel.attachEvent("onresize",function(){ArrayList.refreshRender();});
	}
	ArrayList.refreshRender();
}
function addToArrayListEnd(){
	if(ArrayList.size != 9){
		var input = document.getElementById('ALInput');
		ArrayList.add(input.value);
	}
	else{
		//error
	}
}
function addToArrayList(){
	if(ArrayList.size != 9){
		var index = document.getElementById('ALIndexInput');
		var input = document.getElementById('ALInput');
		ArrayList.add(input.value,new Number(index.value));
	}
	else{
		//error
	}
}
function setToArrayList(){
	var index = new Number(document.getElementById("ALIndexInput").value);
	var input = document.getElementById("ALInput").value;
	try{
		if(index < ArrayList.size){
			ArrayList.set(index,input);
		}
	}
	catch(ex){
		throw ex;
	}
}
function removeFromArrayList(){

	var input = new Number(document.getElementById('ALIndexInput').value);
	try{
		if(input < ArrayList.size){
			ArrayList.remove(input);
		}
	}
	catch(ex){
		//error
		throw ex;
	}
}

/*
	Linked Elements
*/
function setupLinkedList(){
	LinkedListPanel = document.getElementById("LinkedListExample");
	if(LinkedListPanel.addEventListener){
		LinkedListPanel.addEventListener("resize",function(){LinkedList.refreshRender()},false);
	}
	else if(LinkedListPanel.attachEvent){
		LinkedListPanel.attachEvent("onresize",function(){LinkedList.refreshRender()});
	}
	ArrayList.refreshRender();
}
function addToLinkedList(){
	var value = document.getElementById("LLInput").value;
	LinkedList.add(value)
}
function addToLinkedListEnd(){
	var value = document.getElementById("LLInput").value;
	LinkedList.addAtEnd(value);
}
function removeFromLinkedList(){
	LinkedList.remove();
}
function moveToLinkedList(){
	var value = new Number(document.getElementById("LLIndexInput").value);
	LinkedList.gotoIndex(value);
}
function setItemLinkedList(){
	var value = document.getElementById("LLInput").value;
	LinkedList.setItem(value);
}