class ActionManager {
	/*
	StoredAction {
		label: <string>,
		UID: <string>,
		action: [
			ProtonAction {}
		]
	}

	ProtonAction {
		input: MIDIAction | OBSAction,
		output: MIDIAction | OBSAction
	}

	OBSAction {
		type: "event" | "request",
		request: <string>,
		arguments: <JSON>
	}

	MIDIAction {
		type: "input" | "output",
		controller: <string>,
		channel: <int>,
		note: <int>,
		velocity: <int>,
		note_type: "noteon",
		doToggle: <boolean>,
		toggleStatus: <boolean>,
		hold_duration: <int> (milliseconds),
		doOutput: <boolean>,
	}
	*/
	constructor() {
		console.debug(`[ActionManager] New Instance Called`)
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
	
		var MIDIListener = new obs.process.midi();
		obs.modules.ezmidi.getInputs().then((gIn)=>{
			obs.midi.input(obs.modules.ezmidi.Input(gIn)).on('noteon',obs.midi.output)
		});
	}
}
module.exports = ActionManager;
module.exports.defaultHTML = () => {
	return `
<div class="createBinding">
	<ul type="bindInfo">
		<li>Label <input type="text" id="i_bindLabel"></li>
		<li>Device <span data="device">Launchpad MK2</span></li>
		<li>Channel <span data="device">0</span></li>
		<li>Note <span data="note">15</span></li>
	</ul>
	<table class="bindEditor">
		<tr type="header">
			<th></th>
			<th>Action</th>
			<th></th>
			<th>Payload</th>
			<th></th>
		</tr>
		<tr UID="[string:UID]">
			<td type="actionOption">
				<a class="waves-effect waves-dark btn small" action="remove">
					<i class="material-icons">delete_forever</i>
				</a>
			</td>
			<td type="selectAction">
				<select class="browser-default">
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
				<span><span type="controller">Launchpad MK2 [0]</span> C:<span type="channel">0</span> N:<span type="note">44</span> V:<span type="velocity">127</span></span>
			</td>
			<td type="actionRequest">
				<select class="browser-default">
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
							<option data="PlayPauseMedia">Play/Pause</option>
							<option data="RestartMedia">Restart</option>
							<option data="StopMedia">Stop</option>
							<option data="NextMedia">Next</option>
							<option data="PreviousMedia">Previous</option>
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
							<option data="PauseResume">Resume</option>
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
				<span><span type="controller">Launchpad MK2 [1]</span> C:<span type="channel">0</span> N:<span type="note">44</span> V:<span type="velocity">127</span></span>
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