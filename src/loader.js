module.exports = {
	resetFields: () =>{
		$("div.loader span[type=title]").html('');
		$("div.loader span[type=description]").html('');
		console.debug(`[Loader] Reset Fields`);
	},
	show: () =>{
		module.exports.resetFields();
		$("div.loader").fadeIn("1500ms");
		console.debug(`[Loader] Shown`);
	},
	hide: () =>{
		$("div.loader").fadeOut("1500ms");
		module.exports.resetFields();
		console.debug(`[Loader] Hidden`);
	},
	title: (g_content) =>{
		return $("div.loader span[type=title]").html(g_content);
		console.debug(`[Loader] Title Changed to '${g_content}'`);
	},
	description: (g_content) =>{
		return $("div.loader span[type=description]").html(g_content);
		console.debug(`[Loader] Description Changed to '${g_content}'`);
	},
}