# socket

## 快速使用

```js
let ws=new Socket({
    url:"ws://127.0.0.1:3000",
    heartbeatInterval:3000,//心跳检测间隔(可选参数，默认3000ms)
    heartbeatMsg:"hello world",//心跳检测发送的信息(可选参数，默认hello world)
    reconnectInterval:3000,//重连时间间隔(可选参数，默认3000ms)
    reconnectTimes:10,//最大重连次数(注：一次断开后，若重连10次，任然为成功，则不再重连)(可选参数，默认10)
})
//连接成功
ws.open(function(e){
    console.log(e)
    ws.send("init",{
        "name": "somewheve",
        "user": "wh"//必须带有user
    });
});
// 断开连接
// ws.close(function(e){
//     console.log(e)
// });
// 连接错误
ws.error(function(e){
    console.log(e)
});
// 接收对应事件的数据
ws.on("init",function(data){
    console.log(data);
})
```
