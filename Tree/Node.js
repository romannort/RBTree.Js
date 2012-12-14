function RBNode (_key, _value) {
	this.color = RBNode.COLOR_BLACK;
	this.key = _key;
	this.value = _value;
	this.left = null;
	this.right = null;
	this.parent = null;
}

RBNode.prototype.toString = function() {
	return "{ key:" + this.key.toString() + "," +
		"value:" + this.value.toString() + 	"}";
};

RBNode.COLOR_BLACK = 0;
RBNode.COLOR_RED = 1;
