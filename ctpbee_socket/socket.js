class Socket {
    constructor(option) {
        this.ws = null;
        this.eventMap = {};
        //心跳
        this.heartbeatTimer = null;
        this.heartbeatInterval = option.heartbeat || 3000;
        this.heartbeatMsg = option.heartbeatMsg || "hello world";
        //重连
        this.reconnectTimer = null;
        this.reconnectInterval = option.reconnectInterval || 3000;
        this.reconnectTimes = option.reconnectTimes || 10;
        this.option = option;
        this._init();
    }
    _init() {
        clearInterval(this.heartbeatTimer);
        clearInterval(this.reconnectTimer);
        this.ws = new WebSocket(this.option.url);
        this.ws.onopen = () => {
            clearInterval(this.reconnectTimer);
            this._heartbeat();
        }
        this.ws.onclose = () => {
            console.log(9528)
            clearInterval(this.heartbeatTimer);
            this._reconnect();
        }
        this.ws.onmessage = (e) => {
            let type = e.split(">")[0];
            let data = e.split(">")[1];
            let typeFun = this.eventMap["type"];
            typeFun(data);
        };
    }
    _heartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.send("heartbeat", this.heartbeatMsg);
        }, this.heartbeatInterval);
    }
    _reconnect() {
        this.reconnectTimer = setInterval(() => {
            if (this.reconnectTimes > 0) {
                this._init();
                this.reconnectTimes--;
            } else {
                clearInterval(this.reconnectTimer);
                console.log("重连失败");
                return;
            }
        }, this.reconnectInterval);
    }
    open(callback) {
        this.ws.onopen = (e) => {
            console.log("222")
            callback && callback(e);
        }
    }
    close(callback) {
        this.ws.onclose = (e) => {
            callback && callback(e);
        }
    }
    error(callback) {
        this.ws.onerror = (e) => {
            callback && callback(e);
        }
    }
    send(eventName, data) {
        this.ws.send(eventName + ">" + JSON.stringify(data));
    }
    on(eventName, func) {
        this.eventMap[eventName] = func;
    }
}