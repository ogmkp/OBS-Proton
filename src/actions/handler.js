class ActionHandler {
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
					require("./files.json").obs.forEach((f_)=>{
						if (directoryRequest.includes(f_)) {	
							this.functions.push({
								type: directoryObject[0],
								request: directoryRequest,
								f: require(`./obs/${f_}.js`)
							})
						}
					})
						break;
				}
			})
		})
		console.debug(`[ActionHandler] Parsed '${this.functions.length}' Actions`);
		
		$(`table.actionEditor td[type=selectAction] select`).change((me)=>{
			var UID = me.target.parentElement.parentElement.attributes.uid.value;
			var selectedAction = $(`table.actionEditor tr[UID=${UID}] td[type=selectAction] select option:selected`)
			console.log(selectedAction[0].attributes.data.value)
			this.functions.forEach((g_function)=>{
				if (g_function.request != selectedAction[0].attributes.data.value) return;
				g_function.f(g_function.request,UID)
				console.debug(`[ActionHandler] new => Created instance of ${g_function.type}::${g_function.request}`)
			})
		})
		return this;
	}
	event (g_type,g_data) {
		console.debug(`[ActionHandler] event => Recieved new event '${g_type}'`,g_data)
		Object.entries(obs.actions.temporary).forEach((g_action)=>{
			console.log(localStorage.EventTesting_UID == g_action[0])
			if (localStorage.EventTesting_UID == g_action[0]) {
				obs.actionHandler.functions.forEach((f)=>{
					if (f.type == g_type && f.request == g_action[1].inputAction) {
						console.log(f)
						f.f.event(g_data,g_action[0])
					}
				})
			} else {
			}
		})
	}
}
module.exports = ActionHandler;