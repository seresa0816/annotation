//***************************************************************************************//
//
//	FabricJS Object Drawing file
//
//***************************************************************************************//

var classDraw = function (scale, canv_id, width, height) {
	var main = this;

	main.canvasID = canv_id;
	main.canvWidth = width;
	main.canvHeight = height;
	main.canvas = null;

	main.isDrawing = 0;
	main.shape = null;
	main.drawObj = null;
	main.drawRectText = null;
	main.drawSize = 1;
	main.drawColor = "#ff0000";
	main.backColor = "#ff0000";
	main.sPos = { x: 0, y: 0 };
	main.startPosition = { x: 0, y: 0 };
	main.endPosition = { x: 0, y: 0 };
	main.arrowSize = 10;

	main.textWidth = 300;
	main.textHeight = 200;

	main.arrowType = 0;
	main.scale = scale;
	main.unit = "";
	main.parent = null;

	main.fontSize = 15;
	main.fontFamily = "arial";
	main.fontStyle = "normal";

	main.init = function () {
		main.canvasCSS();
		main.initFabric();
		main.initEvent();
	}

	main.canvasCSS = function () {
		$("#" + main.canvasID).attr("width", main.canvWidth);
		$("#" + main.canvasID).attr("height", main.canvHeight);
		$("#" + main.canvasID).css("width", main.canvWidth);
		$("#" + main.canvasID).css("height", main.canvHeight);

		if (main.canvas) {
			main.canvas.setWidth(main.canvWidth);
			main.canvas.setHeight(main.canvHeight);
			main.canvas.renderAll();
			main.canvas.calcOffset();
		}
	}

	main.initFabric = function () {
		main.canvas = new fabric.Canvas(main.canvasID);

		main.canvas.setZoom(main.scale);
		main.canvas.renderAll();
	}

	main.initEvent = function () {
		main.canvas.on("mouse:down", function (evt) {
			var left = evt.e.offsetX / main.parent.scale;
			var top = evt.e.offsetY / main.parent.scale;

			evt.e.stopPropagation();

			if (evt.target)
				main.onObjectSelected();

			if (main.is_select) {
				main.is_select = 0;
				return;
			}

			main.deselectCanvas();
			main.canvas.freeDrawingBrush.color = main.drawColor;

			if (!main.shape)
				return;

			main.isDrawing = 1;
			main.canvas.selection = false;
			main.sPos = { x: left, y: top };

			switch (main.shape) {
				case "rect":
					main.drawObj = new fabric.Rect(
						{
							type: main.shape,
							left: left,
							top: top,
							width: 200,
							height: 150,
							fill: "transparent",
							stroke: 1,
							borderColor: main.drawColor,
							selectable: false,
							hasBorders: true,
						});
					main.canvas.add(main.drawObj);
					break;
				case "arrow":
					var arrow_path = "M 0 -" + main.arrowSize + " L " + main.arrowSize + " 0 L 0 " + main.arrowSize + " z";
					// var arrow_path 	= "M 0 -10 L 0 10 M 0 0 L " + line_dist + " 0 M 0 0 L 5 -3 M 0 0 L 5 3 M " + line_dist + " 0 L " + (line_dist - 5) + " -3 M " + line_dist + " 0 L " + (line_dist - 5) + " 3 M " + line_dist + " -10 L " + line_dist + " 10 z";

					if (main.arrowType == 1) {
						arrow_path = "M 0 0 L 1 0 z";
					}
					else if (main.arrowType == 2) {
						arrow_path = "M 0 -" + main.arrowSize + " L " + main.arrowSize + " 0 L 0 " + main.arrowSize + " z";
						// arrow_path += "L -" + main.arrowSize + " 0 L 0 -" + main.arrowSize + " M -" + main.arrowSize + "0 L " + main.arrowSize + " 0 z";
					}

					var path_obj = new fabric.Path(arrow_path,
						{
							type: main.shape,
							left: 0,
							top: 0,
							stroke: main.drawColor,
							fill: false,
							strokeWidth: 1
						});

					main.drawObj = new fabric.Group([path_obj],
						{
							type: "ruler_group",
							left: left,
							top: top,
							height: 20,
							originY: "center",
							angle: 0,
							selectable: false,
							lockScalingY: true,
						});

					main.canvas.add(main.drawObj);
					break;
				case "text":
					main.drawObj = new fabric.Rect(
						{
							type: main.shape,
							left: left,
							top: top,
							width: main.textWidth,
							height: main.textHeight,
							fill: "transparent",
							stroke: 1,
							borderColor: main.drawColor,
							selectable: false,
							hasBorders: true,
						});

					canvasZoom = main.canvas.getZoom();
					hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
					hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;
					hWidth = main.drawObj.width * canvasZoom;
					hHeight = main.drawObj.height * canvasZoom;

					main.fontSize = $("#font_size h5").html();
					main.fontColor = main.canvas.freeDrawingBrush.color;
					$("#popup_text textarea").css({ "font-size": main.fontSize * canvasZoom });
					$("#popup_text textarea").css({ "color": main.fontColor });
					$("#popup_area").css("left", hPosX + "px");
					$("#popup_area").css("top", hPosY + "px");
					$("#popup_text textarea").focus();
					$("#popup_text textarea").css("width", hWidth + "px");
					$("#popup_text textarea").css("height", hHeight + "px");

					main.showPopup("popup_text");
					main.canvas.add(main.drawObj);
					break;
				case "comment":

					main.backColor = main.canvas.freeDrawingBrush.color;
					main.drawObj = new fabric.Rect(
						{
							type: main.shape,
							left: left,
							top: top,
							width: 200,
							height: 150,
							fill: "yellow",
							stroke: 1,
							borderColor: main.drawColor,
							selectable: false,
							hasBorders: true,
						});

					canvasZoom = main.canvas.getZoom();
					hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
					hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;
					hWidth = main.drawObj.width * canvasZoom;
					hHeight = main.drawObj.height * canvasZoom;

					main.canvas.add(main.drawObj);
					main.fontSize = $("#font_size h5").html() * 2;
					main.fontColor = main.canvas.freeDrawingBrush.color;
					$("#popup_text textarea").css({ "font-size": main.fontSize });
					$("#popup_text textarea").css({ "color": main.fontColor });
					$("#popup_area").css("left", hPosX + "px");
					$("#popup_area").css("top", hPosY + "px");
					$("#popup_text textarea").focus();
					$("#popup_text textarea").css("width", hWidth + "px");
					$("#popup_text textarea").css("height", hHeight + "px");
					main.showPopup("popup_text");

					break;
				case "ruler":
					var arrow_path = "M 0 -7 L 0 7 z";
					var ruler_line = null;
					var ruler_text = null;
					var ruler_back = null;
					var lwidth = 2;

					main.isDrawing = 1;

					ruler_line = new fabric.Path(arrow_path,
						{
							left: 0,
							top: 0,
							stroke: main.drawColor,
							fill: false,
							strokeWidth: 1
						});

					ruler_text = new fabric.Text("Length : 0m",
						{
							type: 'ruler_text',
							left: 0,
							top: -10,
							fill: main.drawColor,
							fontSize: 13,
							fontFamily: "arial"
						});

					ruler_back = new fabric.Rect(
						{
							left: 0,
							top: 0,
							width: ruler_text.width + 12,
							height: ruler_text.height,
							fill: "white",
						});

					main.drawObj = new fabric.Group([ruler_line, ruler_text],
						{
							type: "ruler_group",
							left: left,
							top: top,
							height: 20,
							originY: "center",
							angle: 0,
							lockScalingY: true,
							selectable: false,
						});

					main.canvas.add(main.drawObj);
					break;
				case "picture":

					main.backColor = main.canvas.freeDrawingBrush.color;
					main.drawObj = new fabric.Circle(
						{
							radius: 10,
							strokeWidth: 1,
							left: left,
							top: top,
							fill: main.backColor,
							stroke: 'blue',
							originX: 'center',
							originY: 'center',
							type: 'picture',
							selectable: false,
							hasControls: false
						});

					main.canvas.add(main.drawObj);

					canvasZoom = main.canvas.getZoom();
					hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
					hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;

					$("#popup_area").css("left", hPosX + "px");
					$("#popup_area").css("top", hPosY + "px");
					main.showPopup("popup_picture");

					break;
				case "attach":
					main.backColor = main.canvas.freeDrawingBrush.color;
					main.drawObj = new fabric.Rect(
						{
							width: 15,
							height: 15,
							strokeWidth: 1,
							left: left,
							top: top,
							fill: main.backColor,
							stroke: 'blue',
							originX: 'center',
							originY: 'center',
							type: 'attach',
							selectable: false,
							hasControls: false
						});

					main.canvas.add(main.drawObj);

					canvasZoom = main.canvas.getZoom();
					hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
					hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;
					
					$("#popup_area").css("left", hPosX + "px");
					$("#popup_area").css("top", hPosY + "px");
					
					$("#popup_attach object").removeAttr("data");
					$("#popup_attach a").attr("href", "#");
					$("#popup_attach a").html("");
					main.showPopup("popup_attach");
					break;
			}
		});

		main.canvas.on("mouse:move", function (evt) {
			if (!main.isDrawing)
				return;

			if (!main.drawObj)
				return;

			var left = evt.e.offsetX / main.parent.scale;
			var top = evt.e.offsetY / main.parent.scale;

			var distance = Math.sqrt((left - main.sPos.x) * (left - main.sPos.x) + (top - main.sPos.y) * (top - main.sPos.y));
			var arrow_angle = Math.PI / 4;
			var radius = Math.sqrt(2 * main.arrowSize * main.arrowSize);

			switch (main.shape) {
				case "rect":
					main.drawObj.left = Math.min(left, main.sPos.x);
					main.drawObj.top = Math.min(top, main.sPos.y);

					main.drawObj.width = Math.abs(left - main.sPos.x);
					main.drawObj.height = Math.abs(top - main.sPos.y);
					break;
				case "arrow":
					var angle = Math.atan2(top - main.sPos.y, left - main.sPos.x);
					var arrow_path = "M 0 0 L " + distance + " 0 M " + (distance - main.arrowSize) + " -" + main.arrowSize + " ";
					arrow_path += "L " + distance + " 0 L " + (distance - main.arrowSize) + " " + main.arrowSize;

					if (main.arrowType == 1) {
						arrow_path = "M 0 0 L " + distance + " 0";
					}
					else if (main.arrowType == 2) {
						arrow_path = "M " + main.arrowSize + " -" + main.arrowSize + " ";
						arrow_path += "L 0 0 L " + main.arrowSize + " " + main.arrowSize + " ";
						arrow_path += "M 0 0 L " + distance + " 0 ";
						arrow_path += "M " + (distance - main.arrowSize) + " -" + main.arrowSize + " ";
						arrow_path += "L " + distance + " 0 L " + (distance - main.arrowSize) + " " + main.arrowSize;
					}

					var pointArr = main.pathToPointArr(arrow_path);
					var left = main.drawObj.left - distance / 2;

					main.drawObj._objects[0].set({ path: pointArr, left: distance / (-2) });
					main.drawObj._objects[0].setCoords();
					main.drawObj.set({ angle: angle / Math.PI * 180, width: distance });
					break;
				case "text":
					// main.drawObj.left = Math.min(evt.e.offsetX, main.sPos.x);
					// main.drawObj.top  = Math.min(evt.e.offsetY, main.sPos.y);

					// main.drawObj.width  = Math.abs(evt.e.offsetX - main.sPos.x);
					// main.drawObj.height = Math.abs(evt.e.offsetY - main.sPos.y);
					break;
				case "ruler":
					var line_dist = Math.sqrt(Math.pow(left - main.drawObj.get("left"), 2) + Math.pow(top - main.drawObj.get("top"), 2));

					var line_angle = Math.atan2(top - main.drawObj.get("top"), left - main.drawObj.get("left")) / Math.PI * 180;

					var arrow_path = "M 0 -10 L 0 10 M 0 0 L " + line_dist + " 0 M 0 0 L 5 -3 M 0 0 L 5 3 M " + line_dist + " 0 L " + (line_dist - 5) + " -3 M " + line_dist + " 0 L " + (line_dist - 5) + " 3 M " + line_dist + " -10 L " + line_dist + " 10 z";
					var pointArr = main.pathToPointArr(arrow_path);

					var text_width = 0;
					var text_left = 0;

					main.drawObj._objects[0].set({ path: pointArr, left: line_dist / (-2) });
					main.drawObj._objects[0].setCoords();



					if (main.scale) {
						main.rulerLabel(line_dist, main.scale);
						main.drawObj._objects[1].set({ text: "Length : " + main.rulerLabel(line_dist, main.scale) });
					} else {
						main.drawObj._objects[1].set({ text: "Length : " + main.rulerLabel(Math.round(line_dist * 100) / 100, 1) });
					}
					text_width = main.drawObj._objects[1].width;
					text_left = 0 - text_width / 2;

					main.line_dist = line_dist;
					main.drawObj.set({ angle: line_angle, width: line_dist, noMove: 0 });
					break;
			}

			main.drawObj.setCoords();
			main.canvas.renderAll();
		});

		main.canvas.on("mouse:up", function (evt) {
			main.isDrawing = 0;

			evt.e.stopPropagation();

			switch (main.shape) {
				case "rect":
					canvasZoom = main.canvas.getZoom();
					hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
					hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;
					hWidth = main.drawObj.width * canvasZoom;
					hHeight = main.drawObj.height * canvasZoom;
					main.fontSize = $("#font_size h5").html();
					main.fontColor = main.canvas.freeDrawingBrush.color;
					$("#popup_text textarea").css({ "font-size": main.fontSize * canvasZoom });
					$("#popup_text textarea").css({ "color": main.fontColor });
					$("#popup_area").css("left", hPosX + "px");
					$("#popup_area").css("top", hPosY + "px");
					$("#popup_text textarea").focus();
					$("#popup_text textarea").css("width", hWidth + "px");
					$("#popup_text textarea").css("height", hHeight + "px");
					main.showPopup("popup_text");
					break;
				case "text":

					break;
				case "ruler":
					if (main.line_dist < 0.1) {
						main.canvas.remove(main.drawObj);
						return;
					}

					if (!main.scale) {
						canvasZoom = main.canvas.getZoom();
						hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
						hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;

						$("#popup_area").css("left", hPosX + "px");
						$("#popup_area").css("top", hPosY + "px");
						main.showPopup("popup_scale");
					}
					break;
			}
		});
	}

	main.rulerLabel = function (pixel, scale) {
		var inches = Math.round(pixel / scale * 100) / 100;
		var feet = Math.floor(inches / 12);
		var in_int = Math.floor(inches - feet * 12);
		var in_dec = Math.round((inches - feet * 12 - in_int) * 100);
		var fract = main.reduce(in_dec, 100);

		return feet + " ft " + in_int + " " + fract[0] + "/" + fract[1] + "In";
	}

	main.reduce = function (numerator, denominator) {
		var gcd = function gcd(a, b) {
			return b ? gcd(b, a % b) : a;
		};

		gcd = gcd(numerator, denominator);
		return [numerator / gcd, denominator / gcd];
	}

	main.onObjectSelected = function () {
		main.is_select = 1;
		main.hidePopup();

		if (main.canvas.getActiveObject()) {
			var obj = main.canvas.getActiveObject();
			var left = obj.left;
			var top = obj.top;

			switch (obj.type) {
				case "rect":
					//$("#popup_text textarea").val("ddd");
					break;
				case "picture":
					$("#popup_image img").attr("src", obj.src)
					$("#popup_area").css("left", left + "px");
					$("#popup_area").css("top", top + "px");

					main.showPopup("popup_image");
					break;
				case "attach":
					$("#popup_area").css("left", left + "px");
					$("#popup_area").css("top", top + "px");

					$("#popup_attach object").attr('data', obj.src);
					$("#attach_file").attr("href", obj.src);
					$("#attach_file").html("File : " + obj.file);

					main.showPopup("popup_attach");
					break;
			}

			main.showProperty();
		}
	}

	main.setSelectable = function (option) {
		main.canvas.forEachObject(function (object) {
			object.selectable = option;
		});
	}

	main.showProperty = function () {
		if (main.canvas.getActiveObject()) {
			main.selectObj = main.canvas.getActiveObject();

			switch (main.selectObj.type) {
				case "rect":
					$("#background_area").css("display", "block");
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
				case "text":
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
				case "comment":
					$("#background_area").css("display", "block");
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
			}
			switch (main.selectObj.type) {
				case "path":

					break;
			}
		}
	}

	main.hideProperty = function () {
		switch (main.parent.selTool) {
			case "text":
			case "comment":

				break;

			default:
				$("#font_area").css("display", "none");
				$("#font_style").css("display", "none");
				$("#font_size").css("display", "none");
				$("#background_area").css("display", "none");
				break;
		}
	}

	main.deselectCanvas = function () {
		$("#context_menu").css("display", "none")
		$(".show").removeClass("show");

		main.hideProperty();

		delete main.selectObj;
		main.hidePopup();

		if (!main.drawObj) {
			return;
		}

		switch (main.drawObj.type) {
			case "select":

				main.hidePopup();
				break;
			case "rect":
				var text = $("#popup_text textarea").val();

				$("#popup_text textarea").val("");
				$("#popup_text textarea").html("");

				var text = main.addText({ text: text, color: main.drawColor, width: main.drawObj.width, height: main.drawObj.height, x: main.drawObj.left, y: main.drawObj.top, fontFamily: main.fontFamily })
				var group = new fabric.Group([main.drawObj, text],
					{
						left: main.drawObj.left,
						top: main.drawObj.top,
						type: "rect"
					});

				main.canvas.add(group);
				main.canvas.remove(main.drawObj);

				break;
			case "text":
				var text = $("#popup_text textarea").val();

				$("#popup_text textarea").val("");
				$("#popup_text textarea").html("");

				var text = main.addText({
					text: text,
					color: main.drawColor,
					width: main.drawObj.width,
					height: main.drawObj.height,
					x: main.drawObj.left,
					y: main.drawObj.top,
					fontFamily: main.fontFamily
				});

				main.canvas.add(text);
				main.canvas.remove(main.drawObj);
				break;
			case "comment":
				var text = $("#popup_text textarea").val();

				$("#popup_text textarea").val("");
				$("#popup_text textarea").html("");

				var text = main.addText({ text: text, color: main.drawColor, width: main.drawObj.width, height: main.drawObj.height, x: main.drawObj.left, y: main.drawObj.top, fontFamily: main.fontFamily })
				var group = new fabric.Group([main.drawObj, text],
					{
						left: main.drawObj.left,
						top: main.drawObj.top,
						type: "comment"
					});

				main.canvas.add(group);
				main.canvas.remove(main.drawObj);
				break;
			case "picture":

				break;
		}

		main.drawObj = null;
	}

	main.pathToPointArr = function (path_str) {
		var pArr = path_str.split(" ");
		var rArr = [];
		var tArr = [];
		var ind = 0;

		for (var i = 0; i < pArr.length; i++) {
			if (i % 3 == 0) {
				tArr[0] = pArr[i];
			}

			if (i % 3 == 1) {
				tArr[1] = pArr[i] * 1;
			}

			if (i % 3 == 2) {
				tArr[2] = pArr[i] * 1;
				rArr.push(tArr);
				tArr = [];
			}
		}

		rArr.push(tArr);

		return rArr;
	}

	main.addImage = function (param, callback) {
		if (main.pattern)
			main.canvas.remove(main.pattern);

		var imgObj = fabric.Image.fromURL(param.src, function (img) {
			var scale = Math.min(main.canvWidth / img.width, main.canvHeight / img.height);
			var width = param.width ? param.width : img.width;
			var height = param.height ? param.height : img.height;
			var select = param.selectable;
			var left = param.left ? param.left : 0;
			var top = param.top ? param.top : 0;

			if (param.autofit) {
				width = img.width * scale;
				height = img.height * scale;
			}

			var object = img.set(
				{
					top: top,
					left: left,
					width: width,
					height: height,
					selectable: select,
					angle: 0
				});

			main.pattern = object;
			main.canvas.add(object);

			// if(param.isFront)
			object.bringToFront();

			if (callback)
				callback(img.width, img.height);

			main.canvas.renderAll();
		});
	}

	main.addText = function (param) {
		var selectable = false;

		if (main.parent.selTool == "select")
			selectable = true;

		var object = new fabric.Text(param.text,
			{
				left: param.x,
				top: param.y,
				width: param.width,
				height: param.height,
				fill: param.color,
				fontFamily: param.fontFamily,
				selectable: selectable,
				fontSize: main.fontSize,
				fontStyle: main.fontStyle
			});

		return object;
	}
	main.addRect = function (param) {
		var selectable = false;

		var object = new fabric.Rect(
			{
				left: param.x,
				top: param.y,
				width: param.width,
				height: param.height,
				borderColor: main.drawColor,
				selectable: false
			});

		return object;
	}
	main.copy = function () {
		var active = main.canvas.getActiveObject();

		if (!active)
			return;

		main.clipboard = active;
	}

	main.paste = function (x, y) {
		if (!main.clipboard)
			return;
		console.log(main.clipboard)
		if (!main.clipboard._objects) {

			var copied = main.clipboard.clone();
			copied.left = x;
			copied.top = y;
			main.canvas.add(copied);
			copied.setCoords();
		} else {
			//hkb

			var cm_box = main.clipboard._objects[0, 0].clone();
			cm_box.left = x;
			cm_box.top = y;
			//	main.canvas.add(cm_box);

			var cm_txt = main.clipboard._objects[0, 1].clone();
			cm_txt.left = x;
			cm_txt.top = y;
			//	main.canvas.add(cm_txt);

			var group = new fabric.Group([cm_box, cm_txt],
				{
					left: cm_box.left,
					top: cm_txt.top,
					type: "comment"
				});

			main.canvas.add(group);

		}
		main.canvas.renderAll();
	}

	main.delete = function () {
		var active = main.canvas.getActiveObject();

		if (!active)
			return;

		main.canvas.remove(active);
		main.canvas.renderAll();
	}

	main.showPopup = function (id) {
		$("#popup_area").css("display", "block");
		$("#popup_area").find(".active").removeClass("active");
		$("#popup_area").find("#" + id).addClass("active");
	}

	main.hidePopup = function () {
		$("#popup_area").css("display", "none");
		$("#popup_area").find(".active").removeClass("active");
	}

	main.init();
};
