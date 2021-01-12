class OBSSocket {
	constructor() {
		this.UID = obs.UID();
		console.debug(`[OBSSocket] New Instance Created (${this.UID})`);
		localStorage.OBSSocket_UID = this.UID;

		this.config = {
			address: `${localStorage.OBSSocket_address || 'localhost'}:${localStorage.OBSSocket_port || '4444'}`
		}
		if (localStorage.OBSSocket_password != undefined) {
			this.config.password = localStorage.OBSSocket_password
		}

		this.socket = new obs.modules.OBSWebSocket();
		console.debug(`[OBSSocket] Socket Created`);
		this.connected = false;
		return this;
	}
	async connect() {
		console.log(this.config)
		console.debug(`[OBSSocket] Connecting to '${this.config.address}'`);
		var connectedSocket = await this.socket.connect(this.config);
		console.debug(`[OBSSocket] Connected to '${this.config.address}'`);
		this.connected = true;
		this._cachePopulate = this.cachePopulator();
		return connectedSocket;
	}
	async disconnect() {
		console.debug(`[OBSSocket] Disconnected from '${this.config.address}'`)
		this.connected = false;
		delete this._cachePopulate;
		return await this.socket.disconnect();
	}
	async send(g_name,g_args) {
		if (!this.connected) return;
		console.debug(`[OBSSocket] Sent Request '${g_name}'`);
		var response = await this.socket.send(g_name,g_args || {});
		console.debug(`[OBSSocket] Recieved Request '${g_name}' with data;`,response);
		return await response;
	}
	async sendCallback(g_name,g_args,g_callback) {
		if (!this.connected) return;
		console.debug(`[OBSSocket] Sent Request '${g_name}'`);
		this.socket.send(g_name,g_args||{},(error,data)=>{
			console.debug(`[OBSSocket] Recieved Request '${g_name}' with data;`,data)
			g_callback(error,data);
		})
	}
	on(g_type,g_callback){ 
		if (!this.connected) return;
		console.debug(`[OBSSocket] on => Event Listener Created for; '${g_type}'`)
		return this.socket.on(g_type,g_callback);
	}
	cachePopulator() {
		if (global.obs.cache == undefined) {
			global.obs.cache = {
				input: {},
				output: {}
			}
		}
		global.obs.cache.input._types = [
			"SwitchScenes",
			"SwitchTransition",
			"TransitionBegin",
			"TransitionEnd",
			"TransitionVideoEnd",
			"ProfileChanged",
			"StreamingStarting",
			"StreamingStarted",
			"StreamingStopping",
			"StreamingStopped",
			"RecordingStarting",
			"RecordingStarted",
			"RecordingStopping",
			"RecordingStopping",
			"RecordingStopped",
			"RecordingPaused",
			"RecordingResumed",
			"ReplayStarting",
			"ReplayStarted",
			"ReplayStopping",
			"ReplayStopped",
			"SourceCreated",
			"SourceDestroyed",
			"SourceVolumeChanged",
			"SourceMuteStateChanged",
			"SourceAudioDeactivated",
			"SourceAudioActivated",
			"SourceAudioSyncOffsetChanged",
			"SourceAudioMixersChanged",
			"SourceRenamed",
			"SourceFilterAdded",
			"SourceFilterRemoved",
			"SourceFilterVisibilityChanged",
			"SourceFiltersReordered",
			"MediaPlaying",
			"MediaPaused",
			"MediaRestarted",
			"MediaStopped",
			"MediaNext",
			"MediaPrevious",
			"MediaStarted",
			"MediaEnded",
			"SourceOrderChanged",
			"SceneItemAdded",
			"SceneItemRestarted",
			"SceneItemStopped",
			"SceneItemNext",
			"SceneItemPrevious",
			"SceneItemStarted",
			"SceneItemFinished",
			"PreviewSceneChanged",
			"StudioModeSwitched"
		];
		global.obs.cache.input._queue = new obs.process.queue({log:true,origin:'InputCache'})
		obs.cache.input._types.forEach((g_type)=>{
			global.obs.cache.input._queue.add(()=>{
				this.on(g_type,(t_g_data)=>{
					global.obs.cache.input[g_type] = {
						data: t_g_data,
						timestamp: Date.now()
					}
					console.debug(`[socket -> cache] input => '${g_type}' cached at '${obs.cache.input[g_type].timestamp}' with data;`,obs.cache.input[g_type])
				})
			})
		})
		while (obs.cache.input._queue.storage.items.length == obs.cache.input._types.length) {
			global.obs.cache.input._queue.start()
			console.debug(`[socket -> cache] input => Instance created with ${obs.cache.input._queue.storage.items.length} items`)
			break;
		}
	}
}
module.exports = OBSSocket;