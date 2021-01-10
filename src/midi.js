class MIDI {
	constructor () {
		this.midi = require("easymidi")
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
			return new this.midi.Input(g_data.controller);
		}
	}
	output(g_type,g_data){
		if (g_data.controller == undefined) {
			throw ("Controller undefined");
		} else if (g_data.note == undefined) {
			throw ("Note undefined");
		} else if (g_data.velocity == undefined) {
			throw ("Velocity undefined");
		} else if (g_data.channel == undefined) {
			throw ("Channel undefined");
		} else {
			return new this.midi.Output(g_data.controller);
		}
	}
}
module.exports = MIDI;