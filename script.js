var tree = new RBTree();

window.onload = function (argument) {
	
	for (var i = 1; i <= 20; i++) {
		tree.insert(i, (i*2).toString());
	}
	redraw();
	bindEvent("#get-btn", "click", treeGet);
	bindEvent("#set-btn", "click", treeSet);
	bindEvent("#foreach-btn", "click", treeForeach);
	bindEvent("#insert-btn", "click", treeInsert);
	bindEvent("#delete-btn", "click", treeDelete);
	bindEvent("#update-btn", "click", redraw);
	bindEvent("#tostr-btn", "click", treeTostring);
	tree.addEventListener("onchange", redraw);
};

function drawNode(node, height){
	var divnode = document.createElement("div");
	var text = document.createTextNode(node.value.toString());
	divnode.appendChild(text);
	divnode.className += node.color ? " red" : " black";
	divnode.className += " depth-" + height.toString();
	container.appendChild(divnode);
};

function redraw(){
	var childArray = [];
	var divNode = document.getElementById("container");
	while ( divNode.children.length != 0){
 		divNode.removeChild( divNode.children[0] );
 	}	
	tree.draw(drawNode);
};

function bindEvent(selector, event, func){
	var element = document.querySelector(selector);
	element.addEventListener(event, func, false);
};

function treeGet()
{
	var keynode = document.getElementById("get-key");
	var value = tree.get( parseInt(keynode.value));
	document.getElementById("get-value").value = value;
};

function treeSet()
{
	var setkey = document.getElementById("set-key").value;
	var setvalue = document.getElementById("set-value").value;
	tree.set(parseInt(setkey), setvalue);	
};

function treeForeach(){
	var foreachval = document.getElementById("foreach-val").value;
	tree.forEach( function(node){
		node.value += parseInt(foreachval);
	});
};

function treeInsert(){
	var insertkey = document.getElementById("insert-key").value;
	var insertvalue = document.getElementById("insert-value").value;
	tree.insert(parseInt(insertkey), insertvalue);		
};

function treeDelete(){
	var deletekey = document.getElementById("delete-key").value;
	tree.delete(parseInt(deletekey));			
};

function treeTostring(){
	var str = tree.toString();
	document.getElementById("tostring").value = str;
};