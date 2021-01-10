class md = require("easymidi")

class MIDI {
	constructor () {

	}
	start(){
		
	}
	input(g_data) {
		if (g_data.controller == undefined) {
			throw ("Controller undefined");
		} else if (g_data.note == undefined) {
			throw ("Note undefined");
		} else if (g_data.velocity == undefined) {
			throw ("Velocity undefined");
		} else if (g_data.channel == undefined) {
			throw ("Channel undefined");
		} else {
			return md.Input(g_data.controller);
		}
	}
	output(g_data){
		if (g_data.controller == undefined) {
			throw ("Controller undefined");
		} else if (g_data.note == undefined) {
			throw ("Note undefined");
		} else if (g_data.velocity == undefined) {
			throw ("Velocity undefined");
		} else if (g_data.channel == undefined) {
			throw ("Channel undefined");
		} else {
			return md.Output(g_data.controller);
		}
	}
}