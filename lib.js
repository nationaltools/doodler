function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}


//by bitbof, all rights reserved
var LIB = {};
var requestAnimFrame = (function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
}());
/*LIB.css(el, style)
	Assign multiple style rules to one element. Automatically adds prefix for "transform", "transformOrigin",
	"transition", and "boxSizing"
	example:
	LIB.css(someDiv, {
		border: "1px solid #00f",
		margin: "10px"
	});
	*/
LIB.css = function (el, style) {
	var i;
	for (i in style) {
		if (style.hasOwnProperty(i)) {
			if (i === "transform") {
				el.style.WebkitTransform = style[i];
				el.style.MozTransform = style[i];
				el.style.OTransform = style[i];
				el.style.msTransform = style[i];
			} else if (i === "transformOrigin") {
				el.style.WebkitTransformOrigin = style[i];
				el.style.MozTransformOrigin = style[i];
				el.style.OTransformOrigin = style[i];
				el.style.msTransformOrigin = style[i];
			} else if (i === "transition") {
				el.style.WebkitTransition = style[i];
				el.style.MozTransition = style[i];
				el.style.OTransition = style[i];
				el.style.msTransition = style[i];
			} else if (i === "boxSizing") {
				el.style.WebkitBoxSizing = style[i];
				el.style.MozBoxSizing = style[i];
				el.style.boxSizing = style[i]; //ie, opera
			} else {
				el.style[i] = style[i];
			}
		}
	}
};
/*LIB.getGlobalOff(el)
Returns offset({x: , y: }) of DOM element to the origin of the page
*/
LIB.getGlobalOff = function (el) {
	var result, oElement;
	result = {
		x: 0,
		y: 0
	};
	oElement = el;
	while (oElement !== null) {
		result.x += oElement.offsetLeft;
		result.y += oElement.offsetTop;
		oElement = oElement.offsetParent;
	}
	return result;
};
LIB.loadImageToDataURL = function (p) {
	var callback, src, im;
	callback = p.callback;
	src = p.src;
	im = new Image();
	im.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.width = im.width;
		canvas.height = im.height;
		canvas.getContext("2d").drawImage(im, 0, 0);
		callback(canvas.toDataURL("image/png"));
	};
	im.src = src;
};
/*LIB.color
Basic color operations
c is either {r: (0-255), g: (0-255), b: (0-255)} or {h: (0-360), s: (0-100), v: (0-100)}
*/
LIB.color = {
	rgbToHsv: function (c) {
		var result, r, g, b, minVal, maxVal, delta, del_R, del_G, del_B;
		c.r = Math.max(0, Math.min(255, c.r));
		c.g = Math.max(0, Math.min(255, c.g));
		c.b = Math.max(0, Math.min(255, c.b));
		result = {
			h: 0,
			s: 0,
			v: 0
		};
		r = c.r / 255;
		g = c.g / 255;
		b = c.b / 255;
		minVal = Math.min(r, g, b);
		maxVal = Math.max(r, g, b);
		delta = maxVal - minVal;
		result.v = maxVal;
		if (delta === 0) {
			result.h = 0;
			result.s = 0;
		} else {
			result.s = delta / maxVal;
			del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
			if (r === maxVal) {
				result.h = del_B - del_G;
			} else if (g === maxVal) {
				result.h = (1 / 3) + del_R - del_B;
			} else if (b === maxVal) {
				result.h = (2 / 3) + del_G - del_R;
			}
			if (result.h < 0) {
				result.h += 1;
			}
			if (result.h > 1) {
				result.h -= 1;
			}
		}
		result.h = Math.round(result.h * 360);
		result.s = Math.round(result.s * 100);
		result.v = Math.round(result.v * 100);
		return result;
	},
	hsvToRgb: function (c) {
		var result, h, s, v, var_h, var_i, var_1, var_2, var_3, var_r, var_g, var_b;
		c.h = Math.max(0, Math.min(360, c.h));
		c.s = Math.max(0.001, Math.min(100, c.s)); //bug if 0
		c.v = Math.max(0, Math.min(100, c.v));
		result = {
			r: 0,
			g: 0,
			b: 0
		};
		h = c.h / 360;
		s = c.s / 100;
		v = c.v / 100;
		if (s === 0) {
			result.r = v * 255;
			result.g = v * 255;
			result.b = v * 255;
		} else {
			var_h = h * 6;
			var_i = Math.floor(var_h);
			var_1 = v * (1 - s);
			var_2 = v * (1 - s * (var_h - var_i));
			var_3 = v * (1 - s * (1 - (var_h - var_i)));
			if (var_i === 0) {
				var_r = v;
				var_g = var_3;
				var_b = var_1;
			} else if (var_i === 1) {
				var_r = var_2;
				var_g = v;
				var_b = var_1;
			} else if (var_i === 2) {
				var_r = var_1;
				var_g = v;
				var_b = var_3;
			} else if (var_i === 3) {
				var_r = var_1;
				var_g = var_2;
				var_b = v;
			} else if (var_i === 4) {
				var_r = var_3;
				var_g = var_1;
				var_b = v;
			} else {
				var_r = v;
				var_g = var_1;
				var_b = var_2;
			}
			result.r = var_r * 255;
			result.g = var_g * 255;
			result.b = var_b * 255;
			result.r = Math.round(result.r);
			result.g = Math.round(result.g);
			result.b = Math.round(result.b);
		}
		return result;
	},
	rgbToHex: function (c) {
		var ha, hb, hc;
		ha = (parseInt(c.r, 10)).toString(16);
		hb = (parseInt(c.g, 10)).toString(16);
		hc = (parseInt(c.b, 10)).toString(16);

		function fillUp(p) {
			if (p.length === 1) {
				p = "0" + p;
			}
			return p;
		}
		return "#" + fillUp(ha) + fillUp(hb) + fillUp(hc);
	}
};

/*LIB.attachMouseListener(element, callback)
Sends all mouseevents(move, drag, down, release, touch, scrollwheel) back via callback on AnimationFrame.
What you get in the callback:
event = {
	event:			Original event
	x: (0.0-1.0)	Position inside element
	y: (0.0-1.0)	Position inside element
	absX:			Position in px, element is the origin
	absY:			Position in px, element is the origin
	over:			True on mouseover else undefined
	out:			True on mouseout else undefined
	out:			True on mousedown else undefined
	code:			Buttoncode
	dragdone:		True/false when dragging, else undefined
	dX:				Delta x since last event in px, ONLY when dragging
	dY:				Delta y since last event in px, ONLY when dragging
	touch:			True when using touch
	delta:			+/-0 ScrollWheel
	dTime			When dragging, time(ms) since last event -> to calculate speed
	
	pinch: {		Touch input with 2 fingers -> pinch gesture
		down:		Started pinch gesture
		dX:			Delta x of center point between both fingers
		dY:			Delta y of center point between both fingers
		absX:		Position of center point in px, element is the origin
		absY:		Position of center point in px, element is the origin
		dZoom:		Change of the zoom factor since the pinch/zoom gesture started (initially 1)
	}
}
*/
LIB.attachMouseListener = function (p_el, p_callback) {
	var el, callback, requested, inputData, wheel;
	if (!p_el || !p_callback) {
		return false;
	}
	el = p_el;
	callback = p_callback;
	requested = false;
	inputData = [];

	function handleInput() {
		var input;
		while (inputData.length > 0) {
			input = inputData.shift();
			callback(input);
		}
		requested = false;
	}

	function push(p) {
		inputData.push(p);
		if (!requested) {
			requestAnimFrame(handleInput);
			requested = true;
		}
	}

	function limit(val) {
		return Math.max(0, Math.min(1, val));
	}
	el.onmouseover = function (event) {
		var width, height, offset, x, y;
		if (document.onmousemove) {
			return false;
		}
		width = el.offsetWidth;
		height = el.offsetHeight;
		offset = LIB.getGlobalOff(el);
		x = event.pageX - offset.x;
		y = event.pageY - offset.y;
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			over: true,
			absX: x,
			absY: y
		});
		return false;
	};
	el.onmouseout = function (event) {
		var width, height, offset, x, y;
		if (document.onmousemove) {
			return false;
		}
		width = el.offsetWidth;
		height = el.offsetHeight;
		offset = LIB.getGlobalOff(el);
		x = event.pageX - offset.x;
		y = event.pageY - offset.y;
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			out: true,
			absX: x,
			absY: y
		});
		return false;
	};
	el.onmousemove = function (event) {
		var width, height, offset, x, y;
		if (document.onmousemove) {
			return false;
		}
		width = el.offsetWidth;
		height = el.offsetHeight;
		offset = LIB.getGlobalOff(el);
		x = event.pageX - offset.x;
		y = event.pageY - offset.y;
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			move: true,
			absX: x,
			absY: y
		});
		return false;
	};
	el.onmousedown = function (event) {
		var width, height, offset, x, y, lastX, lastY, buttoncode;
		width = el.offsetWidth;
		height = el.offsetHeight;
		offset = LIB.getGlobalOff(el);
		x = event.pageX - offset.x;
		y = event.pageY - offset.y;
		lastX = x;
		lastY = y;
		buttoncode = event.button;
		var lastTime = new Date().getTime();
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			dragdone: false,
			absX: x,
			absY: y,
			code: buttoncode,
			dX: 0,
			dY: 0,
			down: true,
			dTime: 0
		});
		document.onmousemove = function (event) {
			var delta = new Date().getTime() - lastTime;
			lastTime = new Date().getTime();
			x = event.pageX - offset.x;
			y = event.pageY - offset.y;
			push({
				event: event,
				x: limit(x / width),
				y: limit(y / height),
				dragdone: false,
				absX: x,
				absY: y,
				code: buttoncode,
				dX: x - lastX,
				dY: y - lastY,
				pageX: event.pageX,
				pageY: event.pageY,
				dTime: delta
			});
			lastX = x;
			lastY = y;
			return false;
		};
		document.onmouseup = function (event) {
			push({
				event: event,
				x: limit(x / width),
				y: limit(y / height),
				dragdone: true,
				absX: x,
				absY: y,
				code: buttoncode
			});
			document.onmousemove = undefined;
			document.onmouseup = undefined;
			return false;
		};
		return false;
	};
	function handlePinch(event) {
		var offset, width, height;
		var input = [
			{},
			{}
		];
		var fingers = Math.min(2, event.touches.length);
		var x, y, lastX, lastY;
		var dist, lastDist;
		offset = LIB.getGlobalOff(el);
		width = el.offsetWidth;
		height = el.offsetHeight;
		
		x = 0.5 * (event.touches[0].pageX - offset.x + event.touches[1].pageX - offset.x);
		y = 0.5 * (event.touches[0].pageY - offset.y + event.touches[1].pageY - offset.y);
		lastX = x;
		lastY = y;
		dist = LIB.Vec2.dist({x: event.touches[0].pageX, y: event.touches[0].pageY}, {x: event.touches[1].pageX, y: event.touches[1].pageY});
		lastDist = dist;
		push({
			pinch: {
				down: true,
				absX: x,
				absY: y
			}
		});
		document.ontouchmove = function (event) {
			if (event.touches.length !== 2) {
				return;
			}
			x = 0.5 * (event.touches[0].pageX - offset.x + event.touches[1].pageX - offset.x);
			y = 0.5 * (event.touches[0].pageY - offset.y + event.touches[1].pageY - offset.y);
			dist = LIB.Vec2.dist({x: event.touches[0].pageX, y: event.touches[0].pageY}, {x: event.touches[1].pageX, y: event.touches[1].pageY});
			push({
				pinch: {
					dX: x - lastX,
					dY: y - lastY,
					absX: x,
					absY: y,
					dZoom: dist / lastDist
				}
			});
			lastX = x;
			lastY = y;
			//lastDist = dist;
			return false;
		};
	}
	el.ontouchstart = function (event) {
		var offset, x, y, lastX, lastY, width, height;
		if (event.touches.length == 2) {
			handlePinch(event);
			return;
		}
		if (event.touches.length > 2) {
			return;
		}
		offset = LIB.getGlobalOff(el);
		x = event.touches[0].pageX - offset.x;
		y = event.touches[0].pageY - offset.y;
		lastX = x;
		lastY = y;
		width = el.offsetWidth;
		height = el.offsetHeight;
		var lastTime = new Date().getTime();
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			dragdone: false,
			absX: x,
			absY: y,
			code: 0,
			down: true,
			dX: 0,
			dY: 0,
			touch: true,
			dTime: 0
		});
		document.ontouchmove = function (event) {
			if (event.touches.length !== 1) {
				return;
			}
			x = event.touches[0].pageX - offset.x;
			y = event.touches[0].pageY - offset.y;
			var delta = new Date().getTime() - lastTime;
			lastTime = new Date().getTime();
			push({
				event: event,
				x: limit(x / width),
				y: limit(y / height),
				dragdone: false,
				absX: x,
				absY: y,
				code: 0,
				dX: x - lastX,
				dY: y - lastY,
				touch: true,
				dTime: delta
			});
			lastX = x;
			lastY = y;
			return false;
		};
		document.ontouchend = function (event) {
			push({
				event: event,
				x: limit(x / width),
				y: limit(y / height),
				dragdone: true,
				absX: x,
				absY: y,
				code: 0,
				dX: x - lastX,
				dY: y - lastY,
				touch: true
			});
			document.ontouchmove = undefined;
			document.ontouchend = undefined;
			return false;
		};
		return false;
	};
	wheel = function (event) {
		var delta, width, height, offset, x, y;
		delta = 0;
		if (!event) {
			event = window.event;
		}
		if (event.wheelDelta) {
			delta = event.wheelDelta / 120;
		} else if (event.detail) {
			delta = -event.detail / 3;
		}
		width = el.offsetWidth;
		height = el.offsetHeight;
		offset = LIB.getGlobalOff(el);
		x = event.pageX - offset.x;
		y = event.pageY - offset.y;
		push({
			event: event,
			x: limit(x / width),
			y: limit(y / height),
			delta: delta,
			absX: x,
			absY: y
		});
	};
	el.onmousewheel = wheel;
	el.addEventListener('DOMMouseScroll', wheel, false);
	return true;
};

LIB.Slider = function(p) {
	var div = p.div;
	var enabled = true;
	
	LIB.css(div, {
		width: "100%"
	});
	var value = p.value;
	var valueLabel = document.createElement("div");
	//valueLabel.innerHTML = "20%";
	LIB.css(valueLabel, {
		cssFloat: "right"
	});
	var label = document.createElement("div");
	label.innerHTML = p.label;
	div.appendChild(valueLabel);
	div.appendChild(label);
	label.style.pointerEvents = "none";
	
	
	var inputBox = document.createElement("div");
	LIB.css(inputBox, {
		backgroundColor: "#222",
		height: "40px",
		cursor: "pointer",
		position: "relative",
		border: "1px solid #222"
	});
	div.appendChild(inputBox);
	var inputFilled = document.createElement("div");
	LIB.css(inputFilled, {
		backgroundColor: "#888",
		height: "100%"
	});
	inputBox.appendChild(inputFilled);
	
	
	function update(){
		LIB.css(inputFilled, {
			width: (value * 100) + "%"
		});
	}
	update();
	
	
	LIB.attachMouseListener(div, function (val) {
		if (!enabled) {
			return;
		}
		if(!val.dragdone && val.code === 0) {
			value = Math.min(1, Math.max(0, val.x));
			update();
			p.callback(value);
		}
	});
	
	this.getDiv = function() {
		return div;
	};
	
};


LIB.dist = function(ax, ay , bx, by) {
	return Math.sqrt(Math.pow(ax-bx,2)+Math.pow(ay-by,2));
};

LIB.BezierLine = function() {
	var points = [];
	var lastDot = 0;
	var lastPoint;
	
	function SegmentedAB(params) {
		var result = {};
		var segments = [];

		for(var i = 0; i < params.points.length; i++) {
			(function(i) {
				var length = undefined;
				if( i < params.points.length - 1) {
					length = LIB.dist(params.points[i].x, params.points[i].y, params.points[i + 1].x , params.points[i + 1].y);
				}
				segments[i] = {
					x: params.points[i].x,
					y: params.points[i].y,
					length: length
				};
			})(i);
		}

		result.getAtDist = function(dist) {
			var remainder = Math.min(result.getLength(), dist);
			var i;
			
			/*var fac = remainder / result.getLength();
			return {
				x: (segments[0].x  * fac + segments[segments.length-1].x * (1 - fac)),
				y: (segments[0].y  * fac + segments[segments.length-1].y * (1 - fac))
			};*/
			
			for(i = 0; remainder > segments[i].length && i < segments.length - 2; i++) {
				remainder -= segments[i].length;
			}
			
			var fac = Math.min(1, Math.max(0, remainder / segments[i].length));
			
			return {
				x: (segments[i].x  * (1 - fac) + segments[i + 1].x * fac),
				y: (segments[i].y  * (1 - fac) + segments[i + 1].y * fac)
			};
		};
		result.getLength = function() {
			var result = 0;
			for( var i = 0; i < segments.length - 1; i++) {
				result += segments[i].length;
			}
			return result;
		};

		return result;
	};
	
	function getBezierPoints(p1, p2, p3, p4, segments) {
		var curvePoints = [];
		var t, result;
		for(var i = 0; i <= segments; i++) {
			t = i / segments;
			result = {};
			result.x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * p2.x + 3*(1-t) * Math.pow(t, 2) * p3.x + Math.pow(t, 3) * p4.x;
			result.y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * p2.y + 3*(1-t) * Math.pow(t, 2) * p3.y + Math.pow(t, 3) * p4.y;
			curvePoints[curvePoints.length] = result;
		}
		return curvePoints;
	}
	
	//function segmentedLine
	
	this.add = function(x, y, spacing, callback, controlsCallback) {
		if(lastPoint && x == lastPoint.x && y == lastPoint.y) {
			return;
		}
		lastPoint = {x: x, y: y};
		points[points.length] = {
			x: x,
			y: y,
			spacing: spacing
		};
		
		//calculate directions
		if(points.length === 1) {
			return;
		} else if(points.length === 2) {
			points[0].dir = LIB.Vec2.nor(LIB.Vec2.sub(points[1], points[0]));
			lastDot = spacing;
			return;
		} else {
			points[points.length - 2].dir = LIB.Vec2.nor(LIB.Vec2.sub(points[points.length - 1], points[points.length - 3]));
		}

		//get bezier curve
		var a = points[points.length - 3], b = points[points.length - 2];
		var p1 = a;
		var p2 = LIB.Vec2.add(a, LIB.Vec2.mul(a.dir, LIB.Vec2.dist(a, b) / 4));
		var p3 = LIB.Vec2.sub(b, LIB.Vec2.mul(b.dir, LIB.Vec2.dist(a, b) / 4));
		var p4 = b;
		
		if(callback) {
		
		var curvePoints = getBezierPoints(p1, p2, p3, p4, 40);
		//interate over curve with spacing and callback
		var segmentedAB = SegmentedAB({points:curvePoints});
		var len = segmentedAB.getLength();
		var segments = parseInt((len - lastDot) / spacing);
		for(var i = lastDot; i <= len; i += spacing) {
			var point = segmentedAB.getAtDist(i);
			callback( {
				x: point.x,
				y: point.y, 
				t: i / len
			});
		}
		lastDot = i - len;
		} else {
			lastDot = 0;
			
			controlsCallback({ p1: p1, p2: p2, p3: p3, p4: p4 });
		}
	};
	
	
};

LIB.Vec2 = {
	add: function(p1, p2) {
		return {x: p1.x + p2.x, y: p1.y + p2.y};
	},
	sub: function(p1, p2) {
		return {x: p1.x - p2.x, y: p1.y - p2.y};
	},
	nor: function(p) {
		var len = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
		return {x: p.x / len, y: p.y / len};
	},
	len: function(p) {
		return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
	},
	dist: function(p1, p2) {
		return LIB.Vec2.len(LIB.Vec2.sub(p1, p2));
	},
	mul: function(p, s) {
		return {x: p.x * s, y: p.y * s};
	}
	
};


LIB.Brush = function(p) {
	var context;
	
	var color = {r: 0, g: 0, b: 0}, size = 3, spacing = 0.767, opacity = 1;
	var sizePressure = true, opacityPressure = false;
	var lastDot, lastInput = {x: 0, y: 0};
	var lastPressure;
	var started = false;
	
	var alpha = 0;
	var alphas = [];
	//alphas[1] = new Image();
	//alphas[1].src = "alpha_01.png";
	var alphaCanvas = document.createElement("canvas");
	alphaCanvas.width = 128;
	alphaCanvas.height = 128;
	//mipmapping
	var alphaCanvas2 = document.createElement("canvas");
	alphaCanvas2.width = 64;
	alphaCanvas2.height = 64;
	var alphaCanvas3 = document.createElement("canvas");
	alphaCanvas3.width = 32;
	alphaCanvas3.height = 32;
	
	var bezierLine;
	
	
	var aaBrush = document.createElement("canvas");
	aaBrush.width = 32;
	aaBrush.height = aaBrush.width;
	aaScale = 2;
	
	function updateAlphaCanvas() {
		if(alpha === 0) {
			return;
		}
		var ctx = alphaCanvas.getContext("2d");
		
		ctx.fillStyle = "rgba("+color.r+", "+color.g+", "+color.b+", 1)";
		ctx.fillRect(0,0,128,128);
		
		ctx.save();
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(alphas[alpha], 0, 0, 128, 128);			
		ctx.restore();
		
		ctx = alphaCanvas2.getContext("2d");
		
		ctx.fillStyle = "rgba("+color.r+", "+color.g+", "+color.b+", 1)";
		ctx.fillRect(0,0,64,64);
		
		ctx.save();
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(alphas[alpha], 0, 0, 64, 64);			
		ctx.restore();
		
		ctx = alphaCanvas3.getContext("2d");
		
		ctx.fillStyle = "rgba("+color.r+", "+color.g+", "+color.b+", 1)";
		ctx.fillRect(0,0,32,32);
		
		ctx.save();
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(alphas[alpha], 0, 0, 32, 32);			
		ctx.restore();
	}
	
	
	function drawDot(x, y, size, opacity) {
		if(size > 0) {
			if(alpha === 0) {
				context.strokeStyle = "rgba("+color.r+", "+color.g+", "+color.b+", " + opacity + ")";
				context.lineWidth = Math.max(2, (size * 2));
				context.lineCap = "round";
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(x + 0.001, y);
				context.stroke();
			} else {
				context.save();
				context.globalAlpha = opacity * 0.5;
				
				context.translate(x, y);
				var aCan = alphaCanvas;
				if(size <= 32 && size > 16) {
					aCan = alphaCanvas2;
				} else if(size <= 16) {
					aCan = alphaCanvas3;
				}
				context.scale(size, size);
				context.rotate((x+y)*53123);
				context.drawImage(aCan, -1, -1, 2, 2);
				
				context.restore();
			}
		}
	}
	
	this.startLine = function(x, y, p) {
		
		p = Math.max(0, Math.min(1, p));
		var localOpacity = (opacityPressure) ? (opacity * p * p) : opacity;
		var localSize = (sizePressure) ? Math.max(0.1, p*size) : Math.max(0.1, size);
		
		started = true;
		if(localSize > 1) {
			drawDot(x, y, localSize, localOpacity);
		}
		lastPressure = p;
		lastDot = localSize * spacing;
		lastInput = {x: x, y: y};
		
		bezierLine = new LIB.BezierLine();
		bezierLine.add(x, y, 0, function(){});
	};
	this.goLine = function(x, y, p)
	{
		if(!started) {
			return;
		}
		
		p = Math.max(0, Math.min(1, p));
		var localPressure;
		var localOpacity;
		var localSize = (sizePressure) ? Math.max(0.1, p*size) : Math.max(0.1, size);
		var newsize = localSize;
		var mouseDist = LIB.dist(x, y, lastInput.x, lastInput.y);
		
		var smoothing = 0.8 * Math.min(1, Math.max(0, 1 - Math.pow(mouseDist * 0.07, 2) ));
		//smoothing line
		x = x * (1 - smoothing) + lastInput.x * smoothing;
		y = y * (1 - smoothing) + lastInput.y * smoothing;
		
		var bdist = localSize * spacing;
		
		if(localSize <= 1) {
			
			
			bezierLine.add(x, y, 2/*bdist*/, undefined, function(val){
				var factor = 1;
				localPressure = lastPressure * (1 - factor) + p * factor;
				localOpacity = (opacityPressure) ? (opacity * localPressure * localPressure) : opacity;
				localSize = (sizePressure) ? Math.max(0.1, localPressure * size) : Math.max(0.1, size);
				if(alpha === 1) {
					localOpacity *= 0.1;
				}
				context.strokeStyle = "rgba("+color.r+", "+color.g+", "+color.b+", " + Math.min(1, localOpacity * 1.8) + ")";
				context.lineWidth = localSize * 2;
				context.beginPath();
				context.moveTo(val.p1.x, val.p1.y);
				context.bezierCurveTo(val.p2.x, val.p2.y, val.p3.x, val.p3.y, val.p4.x, val.p4.y);
				context.stroke();
				
			});
		} else {
			bezierLine.add(x, y, bdist, function(val){
				var factor = val.t;
				localPressure = lastPressure * (1 - factor) + p * factor;
				localOpacity = (opacityPressure) ? (opacity * localPressure * localPressure) : opacity;
				localSize = (sizePressure) ? Math.max(0.1, localPressure * size) : Math.max(0.1, size);

				drawDot(val.x, val.y, localSize, localOpacity);
			});
		}
		
		lastPressure = p;
		lastInput = {x: x, y: y};
	};
	this.endLine = function() {
		started = false;
		bezierLine = undefined;
	};
	//cheap n' ugly
	this.drawLineSegment = function(x1, y1, x2, y2) {
		lastInput.x = x2;
		lastInput.y = y2;
		
		if(started || x1 === undefined) {
			return;
		}
		
		var mouseDist = Math.sqrt(Math.pow(x2 - x1, 2.0) + Math.pow(y2 - y1, 2.0));
		var eX = (x2 - x1) / mouseDist;
		var eY = (y2 - y1)  / mouseDist;
		var loopDist;
		var bdist = size * spacing;
		lastDot = size * spacing;
		for(loopDist = lastDot; loopDist <= mouseDist; loopDist += bdist)
		{
			drawDot(x1 + eX * loopDist, y1 + eY * loopDist, size, opacity);
		}
	};
	
	//IS
	this.isStarted = function() {
		return started;
	};
	//SET
	this.setAlpha = function(a) {
		lastInput = {};
		alpha = a;
		updateAlphaCanvas();
	};
	this.setColor = function(c)
	{
		lastInput = {};
		color = c;
		updateAlphaCanvas();
	};
	this.setContext = function(c)
	{
		lastInput = {};
		context = c;
	};
	this.setSize = function(s) {
		size = s;
	};
	this.setOpacity = function(o) {
		opacity = o;
	};
	this.setSpacing = function(s) {
		spacing = s;
	};
	this.sizePressure = function(b) {
		sizePressure = b;
	};
	this.opacityPressure = function(b) {
		opacityPressure = b;
	};
	//GET
	this.getLastInput = function() {
		return lastInput;
	};
	this.getSpacing = function() {
		return spacing;
	};
	this.getSize = function() {
		return size;
	};
};
