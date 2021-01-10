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
		return connectedSocket;
	}
	async disconnect() {
		console.debug(`[OBSSocket] Disconnected from '${this.config.address}'`)
		this.connected = false;
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
}
module.exports = OBSSocket;