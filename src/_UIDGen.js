class UID {
	constructor (g_length) {
	}
}
module.exports = (g_length) => {
	var length = g_length || 6;
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	console.debug(`[UIDGen] Generated UID '${retVal}'(${length})`)
	return retVal;
}