class Storage {
	constructor() {
		// Popup
		localStorage.popup = false;
		localStorage.popup_owner = null;

		// OBS Socket
		localStorage.OBSSocket_UID = null;
		if (localStorage.OBSSocket_address == undefined && localStorage.OBSSocket_port == undefined && localStorage.OBSSocket_password == undefined) {
			localStorage.OBSSocket_allow = false;
		} else {
			localStorage.OBSSocket_allow = true;
		}
		localStorage.MIDI_IN_latestDevice = null;
		localStorage.MIDI_OUT_latestDevice = null;

		console.debug("[Storage] Temporary Variables Emptied");
	}
	defaultBindings(g_type) {
		console.debug(`[Storage] Reset Bindings for '${g_type}'`)
		switch(g_type.toLowerCase().trim()) {
			case "midi":
				localStorage.MIDIBindings = JSON.stringify([]);
				return JSON.parse(localStorage.MIDIBindings);
				/*
				[
					StoredAction {},
					StoredAction {},
					StoredAction {},
					...
				]
				*/
				break;
			default:
				throw "Unknown Binding";
				break;
		}
	}
	createBinding(g_data) {
		var arrMIDIBindings = JSON.parse(localStorage.MIDIBindings);
		var bFound = false;
		arrMIDIBindings.forEach((fBinding)=>{
			if (g_data.UID = fBinding.UID) {
				bFound = true;
				console.debug(`[Storage] createBinding => Binding Already Exists`,g_data);
				throw "Binding Already Exists, Logic Error";
			}
		});

		// If the UID already exists exit.
		if (bFound) return;
		delete global.obs.bindingManager;
		console.debug(`[Storage] createbinding => Creating MIDI Binding`,g_data);

		global.obs.bindingManager = new obs.functions.bindings();
		console.debug(`[Storage] createBinding => Binding Created`,g_data);
	}
	deleteBinding(g_UID) {
		var arrMIDIBindings = JSON.parse(localStorage.MIDIBindings);
		var tempBindings = [];
		arrMIDIBindings.forEach((bind)=>{
			if (g_UID != bind.UID) {
				tempBindings.push(bind)
			}
		})
		console.debug(`[Storage] deleteBinding => Removed '${arrMIDIBindings.length - tempBindings}' object(s)`)
		localStorage.MIDIBindings = JSON.stringify(tempBindings)||"[]";
		return tempBindings;
	}
}

module.exports = Storage;