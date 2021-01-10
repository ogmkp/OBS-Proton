
StoredAction
```
StoredAction {
	label: <string>,
	UID: <string>,
	action: [
		ProtonAction {}
	]
}
```

ProtonAction
```
ProtonAction {
	input: MIDIAction | OBSAction,
	output: MIDIAction | OBSAction
}
```

OBSAction
```
OBSAction {
	actionType: "obs",
	type: "event" | "request",
	request: <string>,
	arguments: <JSON>
}
```

MIDIAction
```
MIDIAction {
	actionType: "midi",
	type: "input" | "output",
	controller: <string>,
	channel: <int>,
	note: <int>,
	velocity: <int>,
	note_type: "noteon",
	doToggle: <boolean>,
	toggleStatus: <boolean>,
	hold_duration: <int> (milliseconds),
}
```