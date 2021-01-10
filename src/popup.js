class PopupWindow {
	constructor (g_owner,g_data) {
		console.debug(`[PopupWindow] New Instance Created`);
		if (localStorage.popup == "true") {
			console.debug(`[PopupWindow] A Popup Window already exists. Logic Error!`);
			throw "A Popup Window already exists. Logic Error!";
		} else {
			this.create(g_owner,g_data);
			$("div.popupWindow div.controls i.close").click(()=>{
				this.remove();
			})
		}
	}
	edit (g_owner,g_data) {
		if (localStorage.popup == "false") return;
		if (g_owner.toLowerCase().trim() == localStorage.popup_owner) {
			// Yep, this is the one!
			console.debug(`[PopupWindow] edit => Editing content`);
			$("div.popupWindow div.contentContainer").html(g_data.html);
			if (g_data.title != undefined) {
				$("div.popupWindow div.controls span[type=title]").html(g_data.title);
			}
			return;
		} else {
			console.debug(`[PopupWindow] edit => Invalid Popup Window Owner!`);
			throw "Invalid Owner"
		}
	}
	remove () {
		if (localStorage.popup == "false") return;
		$("div.popupWindow").fadeOut("150ms");
		localStorage.popup_owner = null;
		localStorage.popup = "false";
		console.debug(`[PopupWindow] remove => Removed Popup Window '${localStorage.popup_owner}'`);
		setTimeout(()=>{
			$("div.popupWindow div.controls span[type=title]").html("HEY! You shouldn't be seeing this?!")
			$("div.popupWindow div.contentContainer").html("<!-- -->");
			return;
		},2500)
	}
	create (g_owner,g_data){
		if (localStorage.popup == "true") return;
		console.debug(`[PopupWindow] Window Owner set to; '${g_owner}'`);
		localStorage.popup_owner = g_owner.toLowerCase().trim();
		localStorage.popup = "true";
		$("div.popupWindow div.contentContainer").html(g_data.html);
		$("div.popupWindow div.controls span[type=title]").html(g_data.title || "Untitled Window");
		console.debug(`[PopupWindow] '${g_owner}' => Window Content Populated`);
		$("div.popupWindow").fadeIn("250ms")
	}
}

module.exports = PopupWindow;