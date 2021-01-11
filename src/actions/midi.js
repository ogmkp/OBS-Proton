module.exports = (g_request,g_uid) => {
	var selectedOption = $(`table.actionEditor tr[UID=${g_uid}] td[type=selectAction] select option:selected`)
	if (obs.actions.temporary[g_uid] == undefined) {
		obs.actions.temporary[g_uid] = {};
	}
	obs.actions.temporary[g_uid].input = {
		actionType: 'midi',
		channel: 0,
		controller: '',
		note: 0,
		note_type: 'noteon',
		velocity: 0,
	}
	console.log(selectedOption)
	$(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions]`).html(`<span><span type="controller">No Device Set</span> C:<span type="channel">0</span> N:<span type="note">0</span> V:<span type="velocity">0</span></span>`);
	console.debug(`[ActionManager] Populated Input for UID '${g_uid}'`,obs.actions.temporary[g_uid].input)
	$(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions]`).attr('data','MIDI');
	module.exports.listener(g_uid)
}
module.exports.listener = (g_uid) => {
	$("table.actionEditor td[type=actionOptions][data=MIDI]").click(()=>{
		if (localStorage.MIDI_IN_latestDevice.length != 4) {
			var action = JSON.parse(localStorage.MIDI_IN_latestDevice)
			if (obs.actions.temporary[g_uid] == undefined) {
				obs.actions.temporary[g_uid] = {};
			}
			obs.actions.temporary[g_uid].input = {
				actionType: 'midi',
				controller: action.device,
				channel: action.channel,
				note: action.note,
				velocity: action.velocity,
				note_type: action._type,
			}
			$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=controller]`).html(action.device)
			$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=channel]`).html(action.channel)
			$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=note]`).html(action.note)
			$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=velocity]`).html(action.velocity)
			console.debug(`[ActionManager] Saved UID ${g_uid} with data;`,obs.actions.temporary[`${g_uid}`].input)
		}
	})
}
module.exports.event = (g_data,g_uid) => {
	Object.entries(obs.actions.temporary).forEach((action)=>{
		if (action[1].input.actionType != 'midi') return;
		var t_action = action[1];
		if (t_action.input.controller != g_data.device) return;
		if (t_action.input.channel != g_data.channel) return;
		if (t_action.input.note != g_data.note) return;
		if (t_action.input.velocity != g_data.velocity) return;
		if (t_action.input.note_type != g_data._type) return;
		console.debug(`[ActionHandler -> midi] Recieved MIDI Input`,g_data)
		obs.requestHandler.event('MIDIInput',g_data,g_uid);
	})
}