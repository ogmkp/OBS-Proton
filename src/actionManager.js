class ActionManager {
	constructor() {
		console.debug(`[ActionManager] New Instance Called`)
		this.tmp = {};
		$("table.bindingTable tr[section=bind] a[action=remove]").click((me)=>{
			console.debug(me);
			var UID = "";
			if (me.target.localName == "a") {
				UID = me.target.parentElement.parentElement.attributes.data.value;
			} else {
				UID = me.target.parentElement.parentElement.parentElement.attributes.data.value;
			}
			obs.storage.deleteBinding(UID);
		})
		$("table.bindingTable tr[section=bind] a[action=settings]").click((me)=>{
			console.debug(me);
			var UID = "";
			if (me.target.localName == "a") {
				UID = me.target.parentElement.parentElement.attributes.data.value;
			} else {
				UID = me.target.parentElement.parentElement.parentElement.attributes.data.value;
			}
			this.editBinding(UID);
		})

		$("div.globalControl a[action=add]").click(()=>{
			this.createBinding();
		})
	}
	async createBinding() {
		var popup = await new obs.process.popup("ActionManager",{title:"Create New Action",html:module.exports.defaultHTML()});
		this.rows = [];
		$("div.createBinding ul.bindingOptions a[action=new]").click(async ()=>{
			this.rows.push(await this.createRow());
			this.refreshListener();
		})
		this.refreshListener();
		setInterval(()=>{
			this.refreshListener();
		},5000)
	}
	createRow() {
		return;
	}
	refreshListener() {
		if (this.tmp.jqueryListen != undefined) {
			delete this.tmp.jqueryListen;
		}
		this.tmp.jqueryListen = module.exports.jqueryListener();
	}
}
module.exports = ActionManager;
module.exports.actionHandle = async (g_action,g_uid) => {
	var ActionHTMLContent = `<!-- -->`;
	switch (g_action) {
		case "MIDIInput":
			return
			break;
		default:
			obs.actions.temporary[g_uid].input = {
				actionType: "obs",
				type: "event",
				request: g_action,
			}
			$(`table.actionEditor tr[UID=${g_uid}] td[type=actionOptions]`).html(ActionHTMLContent);
			console.debug(`[ActionManager] Populated Input for UID '${g_uid}'`,obs.actions.temporary[g_uid].input)
			break;
	}
}
module.exports.requestHandle = async (g_request,g_uid) => {
	var RequestHTMLContent = `<!-- -->`;
	$(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions]`).attr('ass','OBS');
	switch (g_request) {
		case "MIDIOutput":
			return
			break;
		case "OpenProjector":
			$(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions]`).attr('data',g_request);
			obs.actions.temporary[g_uid].output = {
				actionType: "obs",
				type: "request",
				request: g_request,
				arguments: {
					type: "Preview",
					monitor: '-1',
					name: null	
				}
			};
			var Sources = [];
			var obsScenes = await obs.socket.send('GetSceneList');
			obsScenes.scenes.forEach((scene)=>{
				if (scene.name == obsScenes.currentScene) {
					Sources.push(`
					<option data="${scene.name}" for="name" selected>${scene.name}</option>
					`)
				} else {
					Sources.push(`
					<option data="${scene.name}" for="name">${scene.name}</option>
					`)
				}
			})
			RequestHTMLContent = `
			<table>
				<tr>
					<td>
						<select class="browser-default">
							<option data="Preview" for="type">Preview</option>
							<option data="Source" for="type">Source</option>
							<option data="Scene" for="type">Scene</option>
							<option data="StudioProgram" for="type">StudioProgram</option>
							<option data="Multiview" for="type">Multiview</option>
						</select>
					</td>
					<td>
						<select class="browser-default">
							${Sources.join("\n")}
						</select>
					</td>
					<td>
						<input placeholder="Monitor" type="number" />
					</td>
				</tr>
			</table>
			`;
			break;
		case "TriggerHotkeyByName":

			break;
		case "PlayPauseMedia":
		case "RestartMedia":
		case "StopMedia":
		case "NextMedia":
		case "PreviousMedia":

			break;
		case "SetVolume":
		case "ToggleMute":
		case "SetMute":
		case "TakeSourceScreenshot":

			break;
		case "SetCurrentProfile":

			break;
		case "StartStopRecording":
		case "StartRecording":
		case "StopRecording":
		case "PauseRecording":
		case "ResumeRecording":

			break;
		case "StartStopReplayBuffer":
		case "StartReplayBuffer":
		case "StopReplayBuffer":
		case "SaveReplayBuffer":

			break;
		case "SetCurrentScene":

			break;
		case "StartStopStreaming":
		case "StartStreaming":
		case "StopStreaming":

			break;
		case "ToggleStudoMode":
		case "EnableStudoMode":
		case "DisableStudioMode":
	}
	$(`table.actionEditor tr[UID=${g_uid}] td[type=requestOptions]`).html(RequestHTMLContent);
	console.debug(`[ActionManager] Populated Output for UID '${g_uid}'`,obs.actions.temporary[g_uid].output)
}
module.exports.jqueryListener = async () => {
	var MIDIListener = new obs.process.midi();
	var easyMIDI = obs.modules.ezmidi;
	global.obs.actionHandler = new obs.process.actions();
	global.obs.requestHandler = new obs.process.requests();
	obs.modules.ezmidi.getInputs().forEach((g_input)=>{
		var Input = new easyMIDI.Input(g_input)
		Input.on('noteon',(data)=>{
			if (data.velocity == 0) return;
			$("ul[type=bindInfo] span[data=device]").html(g_input)
			$("ul[type=bindInfo] span[data=channel]").html(data.channel)
			$("ul[type=bindInfo] span[data=note]").html(data.note)
			$("ul[type=bindInfo] span[data=velocity]").html(data.velocity)
			var tmpMIDI = data;
			data.device = g_input;
			localStorage.MIDI_IN_latestDevice = JSON.stringify(tmpMIDI);
			console.debug(`[MIDI] Recieved MIDI Input`,data)
			obs.actionHandler.event('midi',data)
		})
	})
	easyMIDI.getOutputs().forEach((g_output)=>{
		if ($(`table.actionEditor td[type=requestOptions][data=MIDI] select[type=MIDIOutput] option`).length == easyMIDI.getOutputs().length) return;

		$("table.actionEditor td[type=requestOptions][data=MIDI] select[type=MIDIOutput]").append(`
			<option data="${g_output}">${g_output}</option>
			`)
	})
	easyMIDI.getInputs().forEach((g_output)=>{
		if ($(`table.actionEditor td[type=actionOptions][data=MIDI] select[type=MIDIInput] option`).length == easyMIDI.getInputs().length) return;

		$("table.actionEditor td[type=actionOptions][data=MIDI] select[type=MIDIInput]").append(`
			<option data="${g_output}">${g_output}</option>
			`)
	})
	/*$("table.actionEditor td[type=actionOptions][data=MIDI]").click((me)=>{
		var UID = "";
		if (me.target.outerHTML.startsWith(`<span type="`)) {
			UID = me.target.parentElement.parentElement.parentElement.attributes.uid.value;
		} else {
			UID = me.target.parentElement.parentElement.attributes.uid.value;
		}
		if (localStorage.MIDI_IN_latestDevice.length != 4) {
			var action = JSON.parse(localStorage.MIDI_IN_latestDevice)
			if (obs.actions.temporary[UID] == undefined) {
				obs.actions.temporary[UID] = {};
			}
			obs.actions.temporary[UID].input = {
				actionType: 'midi',
				type: 'output',
				controller: action.device,
				channel: action.channel,
				note: action.note,
				velocity: action.velocity,
				note_type: action._type,
				doToggle: false,
				hold_duration: 1,
			}
			$(`table.actionEditor tr[uid=${UID}] td[type=actionOptions][data=MIDI] [type=controller]`).html(action.device)
			$(`table.actionEditor tr[uid=${UID}] td[type=actionOptions][data=MIDI] [type=channel]`).html(action.channel)
			$(`table.actionEditor tr[uid=${UID}] td[type=actionOptions][data=MIDI] [type=note]`).html(action.note)
			$(`table.actionEditor tr[uid=${UID}] td[type=actionOptions][data=MIDI] [type=velocity]`).html(action.velocity)
			console.debug(`[ActionManager] Saved UID ${UID} with data;`,obs.actions.temporary[`${UID}`].input)
		}
	})*/
	$("table.actionEditor td[type=selectAction] select").change((me)=>{
		var selectedOption = $("table.actionEditor td[type=selectAction] select option:selected")[0].attributes.data.value;
		console.log($("table.actionEditor td[type=selectAction] select option:selected"))
		var opt = $("table.actionEditor td[type=selectAction] select option:selected")[0]
		var UID = ''
		if (opt.parentElement.parentElement.parentElement.parentElement.attributes.uid == undefined) {
			UID = opt.parentElement.parentElement.parentElement.attributes.uid.value;
		} else {
			UID = opt.parentElement.parentElement.parentElement.parentElement.attributes.uid.value;
		}
		if (obs.actions.temporary[UID] == undefined) {
			obs.actions.temporary[UID] = {};
		}
		obs.actions.temporary[UID].inputAction = selectedOption;
		module.exports.actionHandle(selectedOption,UID);
	})
	$("table.actionEditor td[type=actionRequest] select").change((me)=>{
		var selectedOption = $("table.actionEditor td[type=actionRequest] select option:selected")[0].attributes.data.value;
		var opt = $("table.actionEditor td[type=selectAction] select option:selected")[0]
		var UID = ''
		if (opt.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.uid == undefined) {
			UID = opt.parentElement.parentElement.parentElement.attributes.uid.value;
		} else {
			UID = opt.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.uid.value;
		}
		if (obs.actions.temporary[UID] == undefined) {
			obs.actions.temporary[UID] = {};
		}
		obs.actions.temporary[UID].outputAction = selectedOption;
		//module.exports.requestHandle(selectedOption,UID);

		$(`table.actionEditor tr[uid=${UID}] td[type=requestOptions][ass=OBS] select`).change((me)=>{
			console.debug(me)
			var selectedShit = $(`table.actionEditor tr[uid=${UID}] td[type=requestOptions] select option:selected`)
			console.debug(selectedShit)

			selectedShit.each((option)=>{
				if (option.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.data.value.includes("MIDI")) return;
				obs.actions.temporary[g_uid].output.arguments[option.attributes.for.value] = option.attributes.data.value;
			})
		})
	})
	$("table.actionEditor td[type=actionOption] a[action=test]").click(async (me)=>{
		var uid = '';
		if (me.target.outerHTML.startsWith(`<i class="`)) {
			uid = me.target.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.uid.value;
		} else {
			uid = me.target.parentElement.parentElement.parentElement.parentElement.attributes.uid.value;
		}

		if (localStorage.EventTesting == "false") {
			localStorage.EventTesting = "true"
		} else {
			localStorage.EventTesting = "false"
		}

		localStorage.EventTesting_UID = uid;

		if (obs.actions.temporary[`${uid}`].input == undefined || obs.actions.temporary[`${uid}`].output == undefined) {
			// yeah nah fuck off
			return;
		}

		var thisAction = obs.actions.temporary[`${uid}`];

		console.debug(`[ActionManager] action {test} => Input; ${thisAction.inputAction}`);
		console.debug(`[ActionManager] action {test} => Output; ${thisAction.outputAction}`);

		if (thisAction.input.actionType == 'midi') {
			// MIDI shit will be controlled here
			var midi = await obs.modules.ezmidi;
			var result = new midi.Input(thisAction.input.controller)
			console.log(thisAction)
			console.log(result)
			result.on(thisAction.input.note_type,console.log)
			result.on(thisAction.input.note_type||'noteon',async (msg)=>{
				console.debug(msg,thisAction.input)
				if (msg.note != thisAction.input.note) return;
				if (msg.channel != thisAction.input.channel) return;
				if (msg.velocity != thisAction.input.velocity) return;
				if (msg.device != thisAction.input.controller) return;
				console.debug(`[ActionManager] action {test} => Recieved MIDI Input`,msg)
				if (thisAction.output.actionType == 'midi') {
					var midi_ = await  new obs.modules.ezmidi.Output(thisAction.output.controller)
					midi_.send(thisAction.output.note_type,thisAction.output);
					return;
				} else {
					var obsResult = await obs.socket.send(thisAction.output.request,thisAction.output.arguments);
					console.debug(`[ActionManager] action {test} => Sent '${thisAction.output.request}' with arguments of;`,thisAction.output.arguments);
				}
			})
		} else {
			obs.socket.on(thisAction.input.request,async (data)=>{
				console.debug(`[ActionManager] action {test} => Recieved OBS Data`,data);
				if (thisAction.output.actionType == 'midi') {
					var midi = await new obs.process.midi();
					await midi.input(data);
					return;
				} else {
					var obsResult = await obs.socket.send(thisAction.output.request,thisAction.output.arguments);
					console.debug(`[ActionManager] action {test} => Sent '${thisAction.output.request}' with arguments of;`,thisAction.output.arguments);
				}
			})
		}
	})
}
module.exports.defaultActionRow = () => {
	var UID = new obs.UID(8);
	return `

	`;
}
module.exports.defaultHTML = () => {
	return `
<div class="createBinding">
	<ul type="bindInfo">
		<li>Label <input type="text" id="i_bindLabel"></li>
		<li>Device <span data="device"></span>;</li>
		<li>Channel <span data="channel"></span>;</li>
		<li>Note <span data="note"></span>;</li>
		<li>Velocity <span data="velocity"></span>;</li>
	</ul>
	<table class="actionEditor">
		<tr type="header">
			<th></th>
			<th>Action</th>
			<th></th>
			<th>Payload</th>
			<th></th>
		</tr>
		<tr UID="99d0h3">
			<td type="actionOption">
				<ul>
					<li>
						<a class="waves-effect waves-dark btn small" action="test">
							<i class="material-icons">play_arrow</i>
						</a>
					</li>
					<li>
						<a class="waves-effect waves-dark btn small" action="remove">
							<i class="material-icons">delete_forever</i>
						</a>
					</li>
				</ul>
			</td>
			<td type="selectAction">
				<select class="browser-default" type="actions">
					<option data="NULL" selected disabled>Select Input</option>
					<option data="MIDIInput">MIDI Input</option>
					<optgroup label="OBS" group="obs">
						<optgroup label="&nbsp;Scene">
							<option data="SwitchScenes">Scene Switched</option>
						</optgroup>
						<optgroup label="&nbsp;Transitions">
							<option data="SwitchTransition">Switch Transition</option>
							<option data="TransitionBegin">Transition Started</option>
							<option data="TransitionEnd">Transition Finished</option>
							<option data="TransitionVideoEnd">Transition Video Finished</option>
						</optgroup>
						<optgroup label="&nbsp;Profiles">
							<option data="ProfileChanged">Profile Changed</option>
						</optgroup>
						<optgroup label="&nbsp;Streaming Status">
							<option data="StreamingStarting">Starting</option>
							<option data="StreamingStarted">Started</option>
							<option data="StreamingStopping">Stopping</option>
							<option data="StreamingStopped">Stopped</option>
						</optgroup>
						<optgroup label="&nbsp;Recording Status">
							<option data="RecordingStarting">Starting</option>
							<option data="RecordingStarted">Started</option>
							<option data="RecordingStopping">Stopping</option>
							<option data="RecordingStopped">Stopped</option>
							<option data="RecordingPaused">Paused</option>
							<option data="RecordingResumed">Resumed</option>
						</optgroup>
						<optgroup label="&nbsp;Replay Buffer Status">
							<option data="ReplayStarting">Starting</option>
							<option data="ReplayStarted">Started</option>
							<option data="ReplayStopping">Stopping</option>
							<option data="ReplayStopped">Stopped</option>
						</optgroup>
						<optgroup label="&nbsp;Sources">
							<option data="SourceCreated">Created</option>
							<option data="SourceDestroyed">Destroyed</option>
							<option data="SourceVolumeChanged">Volume Changed</option>
							<option data="SourceMuteStateChanged">Mute State Changed</option>
							<option data="SourceAudioDeactivated">Audio Disabled</option>
							<option data="SourceAudioActivated">Audio Enabled</option>
							<option data="SourceAudioSyncOffsetChanged">Audio Sync Offset Changed</option>
							<option data="SourceAudioMixersChanged">Audio Mixers Changed</option>
							<option data="SourceRenamed">Renamed</option>
							<option data="SourceFilterAdded">Filter Added</option>
							<option data="SourceFilterRemoved">Filter Removed</option>
							<option data="SourceFilterVisibilityChanged">Filter Toggled</option>
							<option data="SourceFiltersReordered">Filter Order Changed</option>
						</optgroup>
						<optgroup label="&nbsp;Media">
							<option data="MediaPlaying">Playing</option>
							<option data="MediaPaused">Paused</option>
							<option data="MediaRestarted">Restarted</option>
							<option data="MediaStopped">Stopped</option>
							<option data="MediaNext">Next</option>
							<option data="MediaPrevious">Previous</option>
							<option data="MediaStarted">Started</option>
							<option data="MediaEnded">Finished</option>
						</optgroup>
						<optgroup label="&nbsp;Scene Items">
							<option data="SourceOrderChanged">Order Changed</option>
							<option data="SceneItemAdded">Added</option>
							<option data="SceneItemRestarted">Restarted</option>
							<option data="SceneItemStopped">Stopped</option>
							<option data="SceneItemNext">Next</option>
							<option data="SceneItemPrevious">Previous</option>
							<option data="SceneItemStarted">Started</option>
							<option data="SceneItemFinished">Finished</option>
						</optgroup>
						<optgroup label="&nbsp;Studio Mode">
							<option data="PreviewSceneChanged">Preview Scene Changed</option>
							<option data="StudioModeSwitched">Mode Switched</option>
						</optgroup>
					</optgroup>
				</select>
			</td>
			<td type="actionOptions">
			
			</td>
			<td type="actionRequest">
				<select class="browser-default">
					<option data="NULL" selected disabled>Select Output</option>
					<option data="MIDIOutput">MIDI Out</option>
					<optgroup label="OBS" data="obs">
						<option data="OpenProjector">Open Projector</option>
						<option data="TriggerHotkeyByName">Trigger Hotkey by Name</option>
						<option data="TriggerHotkeyBySequence">Trigger Hotkey by Sequence</option>
						<optgroup label="&nbsp;Media Control">
							<option data="PlayPauseMedia">Play/Pause</option>
							<option data="RestartMedia">Restart</option>
							<option data="StopMedia">Stop</option>
							<option data="NextMedia">Next</option>
							<option data="PreviousMedia">Previous</option>
						</optgroup>
						<optgroup label="&nbsp;Sources">
							<option data="SetVolume">Volume</option>
							<option data="ToggleMute">Toggle Mute</option>
							<option data="SetMute">Set Mute</option>
							<option data="TakeSourceScreenshot">Screenshot</option>
						</optgroup>
						<optgroup label="&nbsp;Profiles">
							<option data="SetCurrentProfile">Change Profile</option>
						</optgroup>
						<optgroup label="&nbsp;Recording">
							<option data="StartStopRecording">Toggle</option>
							<option data="StartRecording">Start </option>
							<option data="StopRecording">Stop </option>
							<option data="PauseRecording">Pause</option>
							<option data="ResumeRecording">Resume</option>
						</optgroup>
						<optgroup label="&nbsp;Replay Buffer">
							<option data="StartStopReplayBuffer">Toggle Buffer</option>
							<option data="StartReplayBuffer">Start </option>
							<option data="StopReplayBuffer">Stop </option>
							<option data="SaveReplayBuffer">Save Buffer</option>
						</optgroup>
						<optgroup label="&nbsp;Scenes">
							<option data="SetCurrentScene">Change To</option>
						</optgroup>
						<optgroup label="&nbsp;Streaming">
							<option data="StartStopStreaming">Toggle</option>
							<option data="StartStreaming">Start</option>
							<option data="StopStreaming">Stop</option>
						</optgroup>
						<optgroup label="&nbsp;Studio">
							<option data="ToggleStudoMode">Toggle</option>
							<option data="EnableStudoMode">Enable</option>
							<option data="DisableStudioMode">Disable</option>
						</optgroup>
					</optgroup>
				</select>
			</td>
			<td type="requestOptions">
				
			</td>
		</tr>
	</table>
	<ul class="bindingOptions">
		<li>
			<a class="btn-floating btn-medium waves-effect waves-light" action="new"><i class="material-icons">add</i></a>
		</li>
		<li>
			<a class="waves-effect waves-dark btn" action="options">
				<i class="material-icons">settings</i>
			</a>	
		</li>
	</ul>
</div>
	`;
}