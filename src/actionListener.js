class ActionListener {
	constructor () {
		if (localStorage.MIDIBindings == undefined || localStorage.MIDIBindings == "null") {
			obs.storage.defaultBindings("midi");
		}
		var arrBindings = JSON.parse(localStorage.MIDIBindings)
		if (arrBindings.length < 1) {
			console.debug(`[ActionListener] No MIDI Bindings Found`);
		} else {
			arrBindings.forEach((fBind)=>{
				this.action(fBind);
			})
		}
	}
	async run(StoredAction,MIDIData) {

	}
	async sendOutput(StoredAction) {

	}
	async action(StoredAction) {
		console.debug(`[ActionListener] action => Created Instance for '${StoredAction.label}'`);
		obs.midi.getInput(StoredAction.midi.controller).on(StoredAction.midi.note_type,(MIDIData)=>{
			this.run(StoredAction,MIDIData)
		})
	}
}
module.exports = ActionListener;