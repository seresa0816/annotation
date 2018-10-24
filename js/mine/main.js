
jQuery(document).ready(function () {
	var initObj = new initEnv();

	initObj.init();
});

var initEnv = function () {
	var main = this;

	main.drawObj = null;
	main.pdfObj = null;
	main.is_draw = 0;
	main.selTool = 0;
	main.scale = 1.5;

	main.init = function () {
		main.initCSS();
		main.initPDF();
		main.initEvents();
		main.initUploader();
		main.initColors();
		main.initFonts();
		main.initSizes();
		window.addEventListener('resize', main.initCSS);
	}

	main.initPDF = function () {
		main.pdfObj = new classManagePDF();
		main.pdfObj.viewPDF(main.scale, 1, function (drawObj) {
			main.drawObj = drawObj;
			main.drawObj.parent = main;
		});
	}

	main.initCSS = function () {

	}

	main.initEvents = function () {

		$("#menu_area dd").on("click", function (evt) {
			$("#viewer").children(".page:nth-child(" + main.pdfObj.page_num + ")").children(".page-container").css({ "z-index": "0" });

			evt.stopPropagation();

			if (!$(this).hasClass("expand"))
				$(".show").removeClass("show");

			if (!main.drawObj)
				return;

			if ($(this).children("p").attr("tool")) {
				main.selTool = $(this).children("p").attr("tool");
			}
			else {
				return;
			}

			$("#menu_area .active").removeClass("active");
			$("#background_area").css("display", "none");

			$("#font_area").css("display", "none");
			$("#font_style").css("display", "none");
			$("#font_size").css("display", "none");

			$(this).addClass("active");

			switch ($(this).index()) {
				case 0:
					main.drawObj.shape = "select";
					main.drawObj.deselectCanvas();
					main.drawObj.canvas.isDrawingMode = false;

					main.drawObj.canvas.selection = true;
					main.drawObj.setSelectable(true);
					break;
				case 1:
					main.drawObj.canvas.isDrawingMode = true;
					main.drawObj.shape = null;
					main.drawObj.setSelectable(false);
					break;
				case 2:
					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "rect";
					main.drawObj.setSelectable(false);
					break;
				case 3:
					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "arrow";
					main.drawObj.setSelectable(false);
					break;
				case 4:
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");

					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "text";
					main.drawObj.setSelectable(false);
					break;
				case 5:
					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "ruler";
					main.drawObj.setSelectable(false);
					break;
				case 6:
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					$("#background_area").css("display", "block");

					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "comment";
					main.drawObj.setSelectable(false);
					break;
				case 7:
					main.drawObj.shape = "highlight";
					$("#viewer").children(".page:nth-child(" + main.pdfObj.page_num + ")").children(".page-container").css({ "z-index": "999" });
					break;
				case 8:
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					$("#background_area").css("display", "block");

					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "attach";
					main.drawObj.setSelectable(false);
					break;
				case 9:
					main.drawObj.canvas.isDrawingMode = false;
					main.drawObj.shape = "picture";
					main.drawObj.setSelectable(false);
					break;
				case 10:
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
				case 11:
					$("#background_area").css("display", "block");
					break;
			}
		});

		$(".expand").on("click", function () {
			if ($(this).children("ul").hasClass("show")) {
				$(this).children("ul").removeClass("show");
			}
			else {
				$(this).children("ul").addClass("show");
			}
		});

		$("#arrow_list li").on("click", function (evt) {
			var src = $(this).children('img').attr('src');
			var txt = $(this).children("p").html();
			var type = $(this).attr("mode");

			$(this).parent().parent().children("img").attr('src', src);
			$(this).parent().parent().children("p").html(txt);

			$("#arrow_list").removeClass("show");

			main.drawObj.arrowType = type;
			main.selTool = $(this).children("p").attr("tool");

			$(this).parents("dd").children("p").attr("tool", main.selTool);
			evt.stopPropagation();
		});

		$("#comment_list li").on("click", function (evt) {
			var src = $(this).children('img').attr('src');
			var txt = $(this).children("p").html();
			var type = $(this).attr("mode");

			//$(this).parent().parent().children("img").attr('src', src);
			//$(this).parent().parent().children("p").html(txt);

			$("#comment_list").removeClass("show");

			main.selTool = $(this).children("p").attr("tool");
			$(this).parents("dd").children("p").attr("tool", main.selTool);

			if (type == 0) {
				main.drawObj.shape = "comment";
			}
			else {
				main.drawObj.shape = "attach";
			}

			evt.stopPropagation();
		});

		$("#btn_insert_url").on("click", function () {
			main.showPopup("popup_url");
		});

		$("#btn_insert_img").on("click", function () {
			var filename = $("#txt_url").val();
			var param = { src: filename, selectable: true, isFront: 1, left: $("#popup_area").offset().left - main.drawObj.margin_l, top: $("#popup_area").offset().top };

			main.drawObj.addImage(param);
			main.hidePopup();
		});

		$(document).on("contextmenu", function (evt) {
			$("#context_menu").css("top", evt.pageY + "px");
			$("#context_menu").css("left", evt.pageX + "px");
			$("#context_menu").css("display", "none");
			$("#context_menu").fadeIn();

			$("#context_menu").removeClass("disabled");

			if (!main.drawObj.canvas.getActiveObject()) {
				$("#context_menu").addClass("disabled");
			}

			if (main.drawObj.clipboard) {
				$("#context_menu li:nth-child(3)").addClass("enabled");
				$("#context_menu li:nth-child(3)").removeClass("disabled");
			}
			else {
				$("#context_menu li:nth-child(3)").removeClass("enabled");
				$("#context_menu li:nth-child(3)").addClass("disabled");
			}

			if (main.drawObj.canvas.getActiveObject()) {
				switch (main.drawObj.canvas.getActiveObject().type) {
					case "text":
					case "comment":

						break;

					case "ruler_group":
						$("#context_menu li:nth-child(1)").addClass("disabled");
						break;
				}
			}

			evt.stopPropagation();
			evt.preventDefault();
		});

		$("#context_menu li").on("click", function (evt) {
			if ($(this).hasClass("disabled"))
				return;

			switch ($(this).index()) {
				case 0:

					var obj = main.drawObj.canvas.getActiveObject();

					//	alert(obj);

					if (!obj._objects) {

						main.drawObj.drawObj = obj;

						canvasZoom = main.drawObj.canvas.getZoom();
						hPosX = $('.canvas-container').offset().left + obj.left * canvasZoom;
						hPosY = $('.canvas-container').offset().top + obj.top * canvasZoom;
						hWidth = 300 * canvasZoom;
						hHeight = 200 * canvasZoom;

						$("#popup_text textarea").val(obj.text);
						$("#popup_area").css("left", hPosX + "px");
						$("#popup_area").css("top", hPosY + "px");
						$("#popup_text textarea").focus();
						$("#popup_text textarea").css("width", hWidth + "px");
						$("#popup_text textarea").css("height", hHeight + "px");

						obj.visible = false;
						main.showPopup("popup_text");

					} else {
						//hkb
						var cm_box = obj._objects[0, 0].clone();
						var cm_txt = obj._objects[0, 1].clone();


						obj.visible = false;

						main.drawObj.drawObj = cm_box;
						main.drawObj.drawObj.left = obj.left;
						main.drawObj.drawObj.top = obj.top;

						$("#popup_area").css("left", obj.left + "px");
						$("#popup_area").css("top", obj.top + "px");
						$("#popup_text textarea").val(cm_txt.text);
						$("#popup_text textarea").focus();

						main.showPopup("popup_text");

					}
					main.drawObj.canvas.deactivateAll();
					main.drawObj.canvas.renderAll();
					break;
				case 1:
					main.drawObj.copy();
					break;
				case 2:
					zoom = main.drawObj.canvas.getZoom();
					xPos = $("#context_menu").offset().left - $('.canvas-container').offset().left;
					yPos = $("#context_menu").offset().top - $('.canvas-container').offset().top;
					main.drawObj.paste(xPos / zoom, yPos / zoom);
					break;
				case 3:
					main.drawObj.delete();
					main.hidePopup();
					break;
				case 4:

					break;
			}

			$("#context_menu").css("display", "none");
		});

		$("#viewer").on("mouseup", ".page-container", function (evt) {
			main.highlight();
			main.clearSelection();
			evt.preventDefault();
		});

		$("#btn_set").on("click", function () {
			var total_in = $("#txt_real_size").val();

			if ($("#popup_scale").find(":checked").val() == "ft") {
				total_in = $("#txt_real_size").val() * 12;
			}

			main.drawObj.scale = total_in / main.drawObj.line_dist;
			main.drawObj.unit = "in";
			main.drawObj.drawObj._objects[1].set({ text: "Length : " + main.drawObj.rulerLabel(main.drawObj.line_dist, main.drawObj.scale) });
			main.drawObj.canvas.renderAll();
			main.hidePopup();
		});

		$("#tool_area dd").on("click", function () {
			var index = $(this).index();

			if (index == 1) {
				main.scale -= 0.1;
			}
			else {
				main.scale += 0.1;
			}
			var page = main.pdfObj.curr_page;
			var viewport = page.getViewport(main.scale);
			var context = main.pdfObj.curr_context;

			context.viewport = viewport;
			page.render(context);
			main.drawObj.canvas.setZoom(main.scale);
			main.drawObj.canvas.renderAll();
		});
	}

	main.highlight = function () {
		// console.clear();
		var range = window.getSelection().getRangeAt(0),
			parent = range.commonAncestorContainer,
			start = range.startContainer,
			end = range.endContainer;
		var startDOM = (start.parentElement == parent) ? start.nextSibling : start.parentElement;
		var currentDOM = startDOM.nextElementSibling;
		var endDOM = (end.parentElement == parent) ? end : end.parentElement;
		//Process Start Element
		main.highlightText(startDOM, 'START', range.startOffset);
		while (currentDOM != endDOM && currentDOM != null) {
			main.highlightText(currentDOM);
			currentDOM = currentDOM.nextElementSibling;
		}
		//Process End Element
		main.highlightText(endDOM, 'END', range.endOffset);
	}

	main.highlightText = function (elem, offsetType, idx) {
		if (elem.nodeType == 3) {
			var span = document.createElement('span');
			span.setAttribute('class', 'highlight');
			var origText = elem.textContent, text, prevText, nextText;
			if (offsetType == 'START') {
				text = origText.substring(idx);
				prevText = origText.substring(0, idx);
			} else if (offsetType == 'END') {
				text = origText.substring(0, idx);
				nextText = origText.substring(idx);
			} else {
				text = origText;
			}
			span.textContent = text;

			var parent = elem.parentElement;
			parent.replaceChild(span, elem);
			if (prevText) {
				var prevDOM = document.createTextNode(prevText);
				parent.insertBefore(prevDOM, span);
			}
			if (nextText) {
				var nextDOM = document.createTextNode(nextText);
				//parent.appendChild(nextDOM);
				parent.insertBefore(nextDOM, span.nextSibling);
				//parent.insertBefore(span, nextDOM);
			}
			return;
		}
		var childCount = elem.childNodes.length;

		for (var i = 0; i < childCount; i++) {
			if (offsetType == 'START' && i == 0)
				main.highlightText(elem.childNodes[i], 'START', idx);
			else if (offsetType == 'END' && i == childCount - 1)
				main.highlightText(elem.childNodes[i], 'END', idx);
			else
				main.highlightText(elem.childNodes[i]);
		}
	}

	main.clearSelection = function () {
		if (window.getSelection) { window.getSelection().removeAllRanges(); }
		else if (document.selection) { document.selection.empty(); }
	}

	main.initUploader = function () {
		var btn = document.getElementById('btn_file_upload');
		var uploader = new ss.SimpleUpload(
			{
				button: btn,
				url: 'php/file_upload.php',
				name: 'uploadfile',
				multipart: true,
				hoverClass: 'hover',
				focusClass: 'focus',
				responseType: 'json',

				onComplete: function (filename, response) {
					var param = { src: "tmp/" + filename, selectable: true, isFront: 1, left: $("#popup_area").offset().left - main.drawObj.margin_l, top: $("#popup_area").offset().top };

					main.drawObj.drawObj.src = "tmp/" + filename;
					$("#popup_image img").attr("src", "tmp/" + filename);
					$("#popup_image img").css("width", "320px");
					$("#popup_image img").css("height", "240px");
					main.hidePopup();
					main.showPopup("popup_image");
				},
				onError: function () {
					console.log('error');
				}
			});

		var btn1 = document.getElementById('btn_attach_upload');
		var uploader1 = new ss.SimpleUpload(
			{
				button: btn1,
				url: 'php/file_upload.php',
				name: 'uploadfile',
				multipart: true,
				hoverClass: 'hover',
				focusClass: 'focus',
				responseType: 'json',

				onComplete: function (filename, response) {
					$("#popup_attach object").attr('data', "tmp/" + filename);

					$("#attach_file").attr("href", "tmp/" + filename);
					$("#attach_file").html("File : " + filename);

					main.drawObj.drawObj.src = "tmp/" + filename;
					main.drawObj.drawObj.file = filename;
					// $("#popup_image img").attr("src", "tmp/" + filename);

					// main.hidePopup();
					// main.showPopup("popup_image");
				},
				onError: function () {
					console.log('error');
				}
			});
	}

	main.initColors = function () {

		$("#color_area").parent().ColorPicker(
			{
				onChange: function (color, hex) {
					main.drawObj.drawColor = "#ff0000";
					$("#color_area").css("background-color", "#" + hex);
					$("#popup_text textarea").css({ "color": "#" + hex });

					main.drawObj.drawColor = "#" + hex;
					main.drawObj.canvas.freeDrawingBrush.color = main.drawObj.drawColor;
					if (main.drawObj.selectObj) {
						switch (main.drawObj.selectObj.type) {
							case "comment":
								main.drawObj.selectObj._objects[1].set("fill", "#" + hex);
								break;
							case "ruler_group":
								main.drawObj.selectObj._objects[0].set("stroke", "#" + hex);
								break;
							case "text":
								main.drawObj.selectObj.set("fill", "#" + hex);
							case "path":
								main.drawObj.selectObj.set("stroke", "#" + hex);
								break;

						}
					}

					main.drawObj.canvas.renderAll();
				}
			});

		$("#color_background").parent().ColorPicker(
			{
				onChange: function (color, hex) {
					$("#color_background").css("background-color", "#" + hex);

					main.drawObj.backColor = "#" + hex;

					if (main.drawObj.drawObj) {
						main.drawObj.drawObj.set("fill", "#" + hex);
					}

					if (main.drawObj.selectObj) {
						if (main.drawObj.selectObj.type == "comment") {
							main.drawObj.selectObj._objects[0].set("fill", "#" + hex)
						} else {
							main.obj_draw.selectObj.set("fill", "#" + hex);
						}
					}

					main.drawObj.canvas.renderAll();
				}
			});
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

	main.initSizes = function () {
		var length = $("#size_list").children("li").length * 50;

		$("#size_list").css("width", length + "px");
		$("#size_list").find(".border_line").each(function () {
			var size = $(this).parent().attr("mode");

			$(this).css("height", size + "px");
			$(this).css("margin-top", (19 - size) + "px");
		});

		$("#size_list").children("li").on("click", function () {
			main.drawObj.drawSize = $(this).attr("mode");
			main.drawObj.canvas.freeDrawingBrush.width = main.drawObj.drawSize;
		});
	}

	main.initFonts = function () {
		var font_arr = ["Arial Black", "Cursive", "Sans-serif"];
		var font_html = "";
		var height = $("#font_area li").length * 35;

		for (var i = 0; i < font_arr.length; i++) {
			font_html += "<li>" + font_arr[i] + "</li>";
		}

		$("#font_area ul").html(font_html);
		$("#font_area ul").css("height", height + "px");

		$("#font_area li").on("click", function () {
			main.drawObj.fontFamily = $(this).html();

			if (main.drawObj.selectObj) {
				if (main.drawObj.selectObj.type == "comment") {
					main.drawObj.selectObj._objects[1].fontFamily = $(this).html();
				}
				else {
					main.drawObj.selectObj.fontFamily = $(this).html();
				}
			}
			$("#font_area h5").html($(this).html());
			$("#popup_text textarea").css({ "font-family": $(this).html() });
			main.drawObj.canvas.renderAll();
		});

		$("#font_style li").on("click", function () {
			$("#font_style h5").html($(this).html());
			main.drawObj.fontStyle = $(this).html();
			//main.drawObj.fontWeight = $(this).html();
			if (main.drawObj.selectObj) {
				if (main.drawObj.selectObj.type == "comment") {
					//main.drawObj.selectObj._objects[1].fontWeight = $(this).html();
					main.drawObj.selectObj._objects[1].fontStyle = $(this).html();
				}
				else {
					//main.drawObj.selectObj.fontWeight = $(this).html();
					main.drawObj.selectObj.fontStyle = $(this).html();
				}
			}

			//$("#popup_text textarea").css({"font-size" : main.drawObj.fontSize});
			//$("#popup_text textarea").css({"font-weight" : $(this).html()});
			$("#popup_text textarea").css({ "font-style": $(this).html() });
			main.drawObj.canvas.renderAll();
		});

		$("#font_size li").on("click", function () {
			main.drawObj.fontSize = $(this).html();

			$("#font_size h5").html($(this).html());
			if (main.drawObj.selectObj) {
				if (main.drawObj.selectObj.type == "comment") {
					main.drawObj.selectObj._objects[1].fontSize = main.drawObj.fontSize;
				}
				else {
					main.drawObj.selectObj.fontSize = main.drawObj.fontSize;
				}
			}
			$("#popup_text textarea").css({ "font-size": main.drawObj.fontSize });
			main.drawObj.canvas.renderAll();
		});

	}
}
