
// Initalize Global Variable
global.$ = require("jquery")
global.obs = {
	modules: {
		OBSWebSocket: require("obs-websocket-js"),
		jquery: require("jquery"),
		ezmidi: require("easymidi"),
	},
	process: {
		obsSocket: require("./socket.js"),
		storage: require("./storage"),
		queue: require("./queue"),
		popup: require("./popup")
	},
	functions: {
		options: require("./optionsManager"),
		actionListen: require("./actionListener"),
		actionMan: require("./actionManager"),
	},
	loader: require("./loader"),
	arguments: {},
	UID: require("./_UIDGen"),
}
obs.loader.show()
obs.loader.title("Loading")

global.obs.storage = new obs.process.storage();
global.obs.socket = new obs.process.obsSocket();
global.obs.actionListener = new obs.functions.actionListen();
global.obs.actionManager = new obs.functions.actionMan();

$(document).ready(()=>{
	setTimeout(()=>{
		obs.loader.title("Done!")
		setTimeout(()=>{
			obs.loader.hide()
		},2500)
	},2500)
})