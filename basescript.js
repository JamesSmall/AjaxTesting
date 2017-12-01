"use strict";
//keeps from duplicates being loaded
var loadedFiles = new Array();
var expectedRun = 0;
var currentRun = 0;
var useGet = false;
var timer;

function setPage(file){
	if(file === undefined){
		file = window.location.hash.substring(1);

		if(file === undefined || file === null || file === ""){
			file = 'LinkedVArray.html';
		}
	}
	else{
		window.location.hash = file;
	}
	getFile(file,function(ret){
		var obj = document.getElementById('maincontainer');
		while(obj.firstChild){
			obj.removeChild(obj.firstChild);
		}
		var dummyElement = document.createElement("div");
		dummyElement.innerHTML = ret;
		obj.appendChild(dummyElement);

		//force script elements to work
		var js = obj.getElementsByTagName('script');
		var length = js.length; //prevents from an ifinite loop via scripts adding more scripts
		for(var i = 0; i < length;i++){
			fixDynamicJSElement(js[i]);
		}

		//force children onload to run when eleemtns are done loading
		if(currentRun==expectedRun){
			afterRun();
		}
	});
}
 /* Enforces js files to run, However js files are out of order compared to the html elements now :(, it forces external sources first, than evals intenral sources, than onload on the new page elements */
function fixDynamicJSElement(element){
	if(element.src && loadedFiles.indexOf(element.src) === -1){
		var parent = element.parentElement;
		var newScript = document.createElement("script");
		newScript.type = "text/javascript";
		newScript.innerHTML = element.innerHTML;
		newScript.src = element.src;
		newScript.onload = function(){ 
			//script will load from external source, must be referenced
			if(newScript.innerHTML){
				eval(newScript.innerHTML);//can now eval internal script
			}
			currentRun++;
			newScript.onload = element.onload;
			if(currentRun===expectedRun){
				afterRun();
			}
		}
		parent.appendChild(newScript);
		loadedFiles.push(newScript.src);
		expectedRun++;
	}
	else if(element.innerHTML){
		eval(element.innerHTML);
	}
}
function afterRun(){
	var childrenAll = document.getElementById('maincontainer').getElementsByTagName("*");
		for(var i = 0; i < childrenAll.length;i++){
			if(childrenAll[i].onload){
				childrenAll[i].onload();
			}
		}
}
function getFile(src,callback){

	var requester;
	if(window.XMLHttpRequest){
		requester = new XMLHttpRequest();
	}
	else if(ActiveXObject){
		requester = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else{
		//fail state
	}
	
	//var obj = document.getElementById('maincontainer');

	requester.onreadystatechange = function(){
		try{
			if(requester.readyState == 4 && requester.status == 200){
				callback(requester.responseText);
			}
			else if(requester.status > 399){
				useGet = true;
				getFile(src,callback);
			}
		}
		catch(ex){//default to get, failed to load
			useGet = true;
			getFile(src,callback);
		}
	}

	//schoold network can only use get, by default school network only uses get in student server
	if(useGet){
		requester.open("GET",src);
	}
	else{
		try{
			requester.open("POST",src);
		}
		catch(exp){
			console.log("unable to use post, defaulting to get");
			requester.open("GET",src);
		}
	}
	try{
		requester.send();
	}
	catch(ex){//default to get, failed to load
		useGet = true;
		getFile(src,callback);
	}
	
}

function resizeElements(){
	var items = document.getElementsByTagName("*");
	for(var i = 0; i < items.length;i++){
		if(items[i].onresize){
			items[i].onresize();
		}
	}
}
function exit(){
	window.open("credit.html","","width=800,height=85");
}
function setDate(){
	var timeDiv = document.getElementById("timer");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var month = ['January',	'February','March', 'April','May','June','July','August','September','October',	'November,','December'];

	if(dd<10) {
	    dd = '0'+dd;
	} 
	today = month[mm] + '  '+ dd + ', ' + yyyy;
	timeDiv.innerHTML = today;
}
function addEvents(){
	var btn = document.getElementById('exit');
	if(btn.addEventListener){
		btn.addEventListener("click",exit,false);
	}
	else if(btn.attachEvent){
		btn.attachEvent("onclick",exit);
	}
	setDate();
}
if(window.addEventListener){
	window.addEventListener("resize",resizeElements,false);
	window.addEventListener("load",addEvents,false);
}
else if(window.attachEvent){
	window.attachEvent("onresize",resizeElements);
	window.attachEvent("onload",addEvents);
}

