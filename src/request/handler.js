class RequestHandler {
	constructor () {
		this.functions = [];
		Object.entries(require("./directory.json")).forEach((directoryObject)=>{
			directoryObject[1].forEach((directoryRequest)=>{
				switch (directoryObject[0]) {
					case "midi":
						this.functions.push({
							type: directoryObject[0],
							request: directoryRequest,
							f: require(`./midi.js`)
						})
						break;
					case "obs":
						this.functions.push({
							type: directoryObject[0],
							request: directoryRequest,
							f: require(`./obs/${directoryRequest}.js`)
						})
						break;
				}
			})
		})
		console.debug(`[RequestHandler] Parsed '${this.functions.length}' Actions`);

		$(`table.actionEditor td[type=actionRequest] select`).change((me)=>{
			var UID = me.target.parentElement.parentElement.attributes.uid.value;
			var selectedAction = $(`table.actionEditor tr[UID=${UID}] td[type=actionRequest] select option:selected`)
			console.log(selectedAction[0].attributes.data.value)
			this.functions.forEach((g_function)=>{
				if (g_function.request != selectedAction[0].attributes.data.value) return;
				g_function.f(UID);
				console.debug(`[RequestHandler] new => Created instance of ${g_function.type}::${g_function.request}`)
			})
		})
		return this;
	}
	event(g_from,g_data,g_uid) {
		console.debug(`[RequestHandler] event => Recieved new request '${g_from}'`,g_data)
		Object.entries(obs.actions.temporary).forEach((g_action)=>{
			console.log(localStorage.EventTesting_UID == g_action[0])
			obs.requestHandler.functions.forEach((f)=>{
				if (f.request == obs.actions.temporary[g_uid].outputAction) {
					console.log(f)
					f.f.event(g_data,g_action[0])
				}
			})
		})
	}
}
module.exports = RequestHandler;