function RBTree()
{
	this.nil = new RBNode();
	this.nil.left = this.nil.right = this.nil.parent = this.nil;
	this.root = this.nil;
}

RBTree.prototype.forEach = function(func) {
	this.inorderTraversal(this.root.left, func);
};

RBTree.prototype.inorderTraversal = function(x, func){
	if( x !== this.nil){
		this.inorderTraversal(x.left, func);
		func(x);
		this.inorderTraversal(x.right, func);
	}
}

RBTree.prototype.toarrayTraversal = function(x, array) {
	if( x !== this.nil){
		array = this.toarrayTraversal(x.left, array);
		array.push(x);
		array = this.toarrayTraversal(x.right, array);
	}
	return array;	
};

RBTree.prototype.toString = function() {
	return this.toArray().toString();
};

RBTree.prototype.toArray = function() {
	return this.toarrayTraversal(this.root.left, []);
};

RBTree.prototype.count = function() {
	return this.toArray().length;
};

// Get value associated with given key
RBTree.prototype.get = function(key) {
	var node = this.findKey(key);
	return  node ? node.value : node;
};

RBTree.prototype.set = function(key, value){
	this.findKey(key, value);
	this.notify("onchange");
};

RBTree.prototype.findKey = function(key, value) {
	if ( key == null) return null;
	var x = this.root.left;
	if ( x === this.nil){
		return null;
	}
	var isEqual = this.compare( x.key, key);
	while ( isEqual !== 0)
	{
		x = isEqual === 1 ? x.left : x.right;
		if( x === this.nil){
			return null;
		}
		isEqual = this.compare(x.key, key);
	}
	x.value = value ? value : x.value;
	return x;
};

RBTree.prototype.compare = function( a, b){
    if (a === b) return 0;
    if (typeof a === typeof b){
        return a < b ? -1 : 1; 
    }
    else{
    	throw "Invalid type of arguments";
    }
};

RBTree.prototype.addEventListener = function(event, listener) {
	if ( this.listeners == null || this.listeners == undefined){
		this.listeners = [];
	}
	if ( this.listeners[event] == null || this.listeners[event] == undefined){
		this.listeners[event] = [];
	}
	this.listeners[event].push(listener);
};

RBTree.prototype.removeEventListener = function(event, listener) {
	if ( this.listeners[event] == null || this.listeners[event] == undefined){
		return;
	}
	for ( var i = 0; i < this.listeners[event].length; ++i){
		if (this.listeners[event][i] === listener){
			this.listeners[event].splice(i, 1);
		}
		--i;
	}
};

RBTree.prototype.notify = function(event) {
	if ( this.listeners == null || this.listeners == undefined){
		return;
	}
	if ( this.listeners[event] == null || this.listeners[event] == undefined){
		return;
	}

	for (var i = 0; i < this.listeners[event].length; ++i){
		this.listeners[event][i](this);
	}
};

RBTree.prototype.insert = function(key, value) {
	if ( key == null || value == null )
	{
		throw "Arguments not valid";
	}
	var newnode = new RBNode(key, value);
	var node = newnode;
	var tmpnode = null;
	this.BSTreeInsert(node);
	node.color = RBNode.COLOR_RED;
	while(node.parent.color === RBNode.COLOR_RED){
		if(node.parent === node.parent.parent.left){
			tmpnode = node.parent.parent.right;
			if( tmpnode.color === RBNode.COLOR_RED){
				node.parent.color = RBNode.COLOR_BLACK;
				tmpnode.color = RBNode.COLOR_BLACK;
				node.parent.parent.color = RBNode.COLOR_RED;
				node = node.parent.parent;
			}
			else{
				if( node === node.parent.right){
					node = node.parent;
					this.leftRotate( node);
				}
				node.parent.color = RBNode.COLOR_BLACK;
				node.parent.parent.color = RBNode.COLOR_RED;
				this.rightRotate( node.parent.parent);
			}
		}
		else{
			tmpnode = node.parent.parent.left;
			if(tmpnode.color === RBNode.COLOR_RED){
				node.parent.color = RBNode.COLOR_BLACK;
				tmpnode.color = RBNode.COLOR_BLACK;
				node.parent.parent.color = RBNode.COLOR_RED;
				node = node.parent.parent;
			}
			else{
				if( node === node.parent.left){
					node = node.parent;
					this.rightRotate(node);
				}
				node.parent.color = RBNode.COLOR_BLACK;
				node.parent.parent.color = RBNode.COLOR_RED;
				this.leftRotate(node.parent.parent);
			}
		}
	}
	this.root.left.color = RBNode.COLOR_BLACK;
	return newnode;
};

RBTree.prototype.thisSuccessor = function(x) {
	var root = this.root;
	var y = x.right;
	if(y !== this.nil){
		while(y.left !== this.nil){
			y = y.left;
		}
		return y;
	}
	else{
		y = x.parent;
		while( x === y.right){
			x = y;
			y = y.parent;
		}
		if( y === root){
			return this.nil;
		}
		return y;
	}
};

RBTree.prototype.thisPredecessor = function(x) {
	var root = this.root;
	var y = x.left;
	if( y !== this.nil){
		while( y.right !== this.nil){
			y = y.right;
		}
		return y;
	}
	else{
		y = x.parent;
		while( x === y.left){
			if(y === root){
				return this.nil;
			}
			x = y;
			y = y.parent;
		}
		return y;
	}
};

RBTree.prototype.delete = function( item ) {
	if ( typeof item != RBNode){
		item = this.findKey(item);
	}
	if ( item == null || item == undefined ) throw "Invalid argument";

	var root = this.root;
	var y = null, x = null;

	if( item.left === this.nil || item.right === this.nil){
		y = item;
	}
	else{
		y = this.thisPredecessor(item);
	}

	if( y.left === this.nil){
		x = y.right;
	}
	else{
		x = y.left;
	}
	x.parent = y.parent;
	if( root === x.parent){
		root.left = x;
	}
	else{
		if( y === y.parent.left){
			y.parent.left = x;
		}
		else{
			y.parent.right = x;
		}
	}

	if( y !== item){
		if(y.color === RBNode.COLOR_BLACK){
			this.deleteFixup(x);
		}

		y.left = item.left;
		y.right = item.right;
		y.parent = item.parent;
		y.color = item.color;
		item.left.parent = item.right.parent = y;

		if(item === item.parent.left){
			item.parent.left = y;
		}
		else{
			item.parent.right = y;
		}
	}
	else{
		if( y.color === RBNode.COLOR_BLACK){
			this.deleteFixup(x);
		}
	}
	if ( this.count() == 0){
		this.notify("onempty");
	}
};

RBTree.prototype.leftRotate = function(x) {

	var y = x.right;
	x.right = y.left;
	if( y.left !== this.nil){
		y.left.parent = x;
	}
	y.parent = x.parent;
	if(x === x.parent.left){
		x.parent.left = y;
	}
	else{
		x.parent.right = y;
	}
	y.left = x;
	x.parent = y;
};

RBTree.prototype.rightRotate = function( y) {
	var x = y.left;
	y.left = x.right;

	if(x.right !== this.nil){
		x.right.parent = y;
	}

	x.parent = y.parent;

	if( y === y.parent.left){
		y.parent.left = x;
	}
	else{
		y.parent.right = x;
	}
	x.right = y;
	y.parent = x;
};

RBTree.prototype.BSTreeInsert = function(node) {
	var root = this.root;
	var x = this.root.left;
	node.left = node.right = this.nil;
	while( x !== this.nil){
		root = x;
		if( this.compare( x.key, node.key) === 1){
			x = x.left;
		}
		else{
			x = x.right;
		}
	}

	node.parent = root;
	if( root === this.root || 
		this.compare(root.key, node.key) === 1){
		root.left = node;
	}
	else{
		root.right = node;
	}
};

RBTree.prototype.deleteFixup = function(x) {
	var root = this.root.left;
	var w = null;
	while( x.color === RBNode.COLOR_BLACK && root !== x){

		if(x === x.parent.left){
			w = x.parent.right;
			if( w.color === RBNode.COLOR_RED){
				w.color = RBNode.COLOR_BLACK;
				x.parent.color = RBNode.COLOR_RED;
				this.leftRotate( x.parent);
				w = x.parent.right;
			}

			if ( w.right.color === RBNode.COLOR_BLACK &&
				w.left.color === RBNode.COLOR_BLACK){
				
				w.color = RBNode.COLOR_RED;
				x = x.parent;
			}
			else{
				if ( w.right.color === RBNode.COLOR_BLACK){
					w.left.color = RBNode.COLOR_BLACK;
					w.color = RBNode.COLOR_RED;
					this.rightRotate( w);
					w = x.parent.right;
				}
				w.color = x.parent.color;
				x.parent.color = RBNode.COLOR_BLACK;
				w.right.color = RBNode.COLOR_BLACK;
				this.leftRotate( x.parent);
				x = root;
			}
		}
		else{
			w = x.parent.left;
			if(w.color === RBNode.COLOR_RED){
				w.color = RBNode.COLOR_BLACK;
				x.parent.color = RBNode.COLOR_RED;
				this.rightRotate( x.parent);
				w = x.parent.left;
			}
			if( w.right.color === RBNode.COLOR_BLACK &&
				w.left.color === RBNode.COLOR_BLACK){

				w.color = RBNode.COLOR_RED;
				x = x.parent;
			}
			else{
				if ( w.left.color === RBNode.COLOR_BLACK){
					w.right.color = RBNode.COLOR_BLACK;
					w.color = RBNode.COLOR_RED;
					this.leftRotate( w);
					w = x.parent.left;
				}
				w.color = x.parent.color;
				x.parent.color = RBNode.COLOR_BLACK;
				w.left.color = RBNode.COLOR_BLACK;
				this.rightRotate(x.parent);
				x = root;
			}
		}
	}
	x.color = RBNode.COLOR_BLACK;
	if ( this.nil.color !== RBNode.COLOR_BLACK){
		throw new Exception("Invalid colors");
	}
};

RBTree.prototype.draw = function(func){
	this.drawTraversal(this.root.left, func, 1);
};

RBTree.prototype.drawTraversal = function(x, func, height){
	if( x !== this.nil){
		this.drawTraversal(x.left, func, height + 1);
		func(x, height);
		this.drawTraversal(x.right, func, height + 1);
	}
};