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
	$(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions]`).html(`
<table>
	<tr>
		<td>
			<select class="browser-default" type="MIDIInput">

			</select>
		</td>
		<td>
			<select class="browser-default" type="MIDIType">
				<option data="noteon" selected>Note On</option>
				<option data="noteoff">Note Off</option>
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
				<option data="reset">Reset</option>
			</select>
		</td>
	</tr>
</table>
<ul type="actionOptions">
	<li>
		<label for="channel">Channel</label>
		<input type="number" id="channel" min="0" max="15"/>
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
	console.debug(`[ActionManager] Populated Input for UID '${g_uid}'`,obs.actions.temporary[g_uid].input)
	$(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions]`).attr('data','MIDI');
	module.exports.listener(g_uid)
}
module.exports.listener = (g_uid) => {
	/*$("table.actionEditor td[type=actionOptions][data=MIDI]").click(()=>{
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
	})*/
	$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] select`).change(()=>{
		module.exports.changeHandle(g_uid)
	})
	$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] input`).change(()=>{
		module.exports.changeHandle(g_uid)
	})
}
module.exports.changeHandle = (g_uid) => {
	module.exports.setFormData(g_uid,{
		actionType: 'midi',
		device: $(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions][data=MIDI] select[type=MIDIInput] option:selected`)[0].attributes.data.value,
		channel: parseInt($(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions][data=MIDI] ul[type=actionOptions] input#channel`).val()),
		note: parseInt($(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions][data=MIDI] ul[type=actionOptions] input#note`).val()),
		velocity: parseInt($(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions][data=MIDI] ul[type=actionOptions] input#velocity`).val()),
		_type: $(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions][data=MIDI] select[type=MIDIType] option:selected`)[0].attributes.data.value || 'noteon',
	})
}
module.exports.setFormData = (g_uid,g_data) => {
		if (obs.actions.temporary[g_uid] == undefined) {
			obs.actions.temporary[g_uid] = {};
		}
		console.log(g_uid,g_data)
		obs.actions.temporary[g_uid].input = {
			actionType: 'midi',
			controller: g_data.device,
			channel: g_data.channel,
			note: g_data.note,
			velocity: g_data.velocity,
			note_type: g_data._type,
		}
		$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=controller]`).html(g_data.device)
		$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=channel]`).html(g_data.channel)
		$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=note]`).html(g_data.note)
		$(`table.actionEditor tr[uid=${g_uid}] td[type=actionOptions][data=MIDI] [type=velocity]`).html(g_data.velocity)
		console.debug(`[ActionManager] Saved UID ${g_uid} with data;`,obs.actions.temporary[`${g_uid}`].input)
}
module.exports.event = (g_data,g_uid) => {
	Object.entries(obs.actions.temporary).forEach((action)=>{
		if (action[1].input.actionType != 'midi') return;
		var t_action = action[1];
		console.log(t_action,g_data)
		if (t_action.input.controller != g_data.device) return;
		if (t_action.input.channel != g_data.channel) return;
		if (t_action.input.note != g_data.note) return;
		if (t_action.input.velocity != g_data.velocity) return;
		if (t_action.input.note_type != g_data._type) return;
		console.debug(`[ActionHandler -> midi] Recieved MIDI Input`,g_data)
		obs.requestHandler.event('MIDIInput',g_data,g_uid);
	})
}