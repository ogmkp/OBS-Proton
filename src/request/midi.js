module.exports = (g_uid) => {
	if (obs.actions.temporary[g_uid] == undefined) {
		obs.actions.temporary[g_uid] = {};
	}
	obs.actions.temporary[g_uid].output = {
		actionType: 'midi',
		channel: 0,
		controller: '',
		note: 0,
		note_type: 'noteon',
		velocity: 0,
	}
	$(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions]`).html(`
<table>
	<tr>
		<td>
			<select class="browser-default" type="MIDIOutput">

			</select>
		</td>
		<td>
			<select class="browser-default" type="MIDIType">
				<option data="noteon">Note On</option>
				<!--option data="noteoff">Note Off</option>
				<option data="poly aftertouch">Poly Aftertouch</option>
				<option data="cc">CC</option>
				<option data="program">Program</option>
				<option data="channel aftertouch">Channel Aftertouch</option>
				<option data="pitch">Pitch</option>
				<option data="position">Position</option>
				<option data="mtc">Timecode</option>
				<option data="select">Select</option>
				<option data="clock">Clock</option>
				<option data="start">Start</option>
				<option data="continue">Continue</option>
				<option data="stop">Stop</option>
				<option data="activesense">MIDI Active Sense</option>
				<option data="reset">Reset</option-->
			</select>
		</td>
	</tr>
</table>
<ul type="requestOptions">
	<li>
		<label for="channelPicker">Channel</label>
		<input type="number" id="channelPicker" min="0" max="15"/>
	</li>
	<li>
		<label for="note">Note</label>
		<input type="number" id="note" min="0" max="127"/>
	</li>
	<li>
		<label for="velocity">Velocity</label>
		<input type="number" id="velocity" min="0" max="127"/>
	</li>
</ul>
		`);
	console.debug(`[RequestHandler] Populated Output for UID '${g_uid}'`,obs.actions.temporary[g_uid].output)
	$(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions]`).attr('data','MIDI');
	module.exports.listener(g_uid)
}
module.exports.listener = (g_uid) => {
	$(`table.actionEditor tr[uid=${g_uid}] td[type=requestOptions][data=MIDI] input`).change(()=>{
		module.exports.changeHandle(g_uid)
	})
}
module.exports.changeHandle = (g_uid) => {
	if (obs.actions.temporary[g_uid] == undefined) {
		obs.actions.temporary[g_uid] = {};
	}
	console.log($(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] select[type=MIDIOutput] option:selected`))
	obs.actions.temporary[g_uid].output = {
		actionType: 'midi',
		controller: $(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] select[type=MIDIOutput] option:selected`)[0].attributes.data.value,
		channel: $(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] ul[type=requestOptions] input#channelPicker`).val(),
		note: $(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] ul[type=requestOptions] input#note`).val(),
		velocity: $(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] ul[type=requestOptions] input#velocity`).val(),
		note_type: $(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions][data=MIDI] select[type=MIDIType] option:selected`)[0].attributes.data.value,
	}
	console.debug(`[RequestHandler] Saved UID ${g_uid} with data;`,obs.actions.temporary[`${g_uid}`].input)
}
module.exports.event = (g_data,g_uid) => {
	console.log(g_data,g_uid)
	var MIDIOutput = new obs.modules.ezmidi.Output(obs.actions.temporary[g_uid].output.controller)
	MIDIOutput.send(obs.actions.temporary[g_uid].output.note_type,obs.actions.temporary[g_uid].output)
	/*Object.entries(obs.actions.temporary).forEach((action)=>{
		if (action[1].input.actionType != 'midi') return;
		var t_action = action[1];
		if (t_action.input.controller != g_data.device) return;
		if (t_action.input.channel != g_data.channel) return;
		if (t_action.input.note != g_data.note) return;
		if (t_action.input.velocity != g_data.velocity) return;
		if (t_action.input.note_type != g_data._type) return;
		console.debug(`[RequestHandler -> midi] Recieved MIDI Input`,g_data)
		obs.requestHandler.event('MIDIInput',g_data);
	})*/
}