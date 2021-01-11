module.exports = (g_type) => {
	if (g_type == 'action') return;
	var ourAction = "OpenProjector";
	$(`table.actionEdtior td[type=selectAction] select`).change((me)=>{
		var selectedOptions = $(`table.actionEdtior td[type=selectAction] select option:selected`)
		selectedOptions.each((g_option)=>{
			console.debug(g_option)
		})
	})
}