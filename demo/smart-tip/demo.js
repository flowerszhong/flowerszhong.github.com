$(function() {
	var $container = $("#container"),
		$btn = $("#btn"),
		content = "苍井优的出道要追溯到公演于1999年的音乐剧《安妮》, " +
			"万人候选，她脱颖而出，被选中出演波丽一角。" +
			"后来她又被选为三井不动产的少女代言人，" +
			"其清丽的形象一时间变得家喻户晓。";
	var smartTipInstance = new SmartTip({
		container: $container,
		trigger: $btn,
		content: content,

		borderColor: "#adadad",
		borderWidth: 1,
		borderRadius: 5,
		bgColor: "white",
		width: 160,
		height: 200,
		arrowSize: 10
	});

	smartTipInstance.show();

	$("#btn").draggable({
		containment: "parent"
	});

	$("#btn1").draggable({
		containment: "parent"
	});
	$("#btn").on("dragstop", function(event, ui) {
		smartTipInstance.attachTo($("#btn"));
		smartTipInstance.show();
	});

	$("#btn1").on("dragstop", function(event, ui) {
		smartTipInstance.attachTo($("#btn1"));
		smartTipInstance.show();
	});
})