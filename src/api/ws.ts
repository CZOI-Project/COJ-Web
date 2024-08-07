import { useUserStore } from "@/store/user";
import { useGlobalStore } from "@/store/global";
import {COJConfig} from "@/config";

//建立websocket连接
export const connect = async () => {
    try{
        await new Promise((resolve, reject) => {
            // 首先判断是否已经连接
            const globalStore = useGlobalStore();
            const userStore = useUserStore();
            if(globalStore.ws.isConnected){
                resolve(globalStore.ws);
                return;
            }
            // 然后尝试连接并挂载事件
            const socket = new WebSocket(COJConfig.ws + "/" + userStore.token);
            socket.onopen = () => {
                globalStore.ws.isConnected = true;
                console.log("Connected");
                resolve(socket);
            }
            socket.onclose = () => {
                globalStore.ws.isConnected = false;
                mdui.snackbar({
                    message: '与COJ实时通信服务器断开连接.'
                });
            }
            socket.onmessage = (e) => {
                let obj = JSON.parse(e.data);
                const globalStore = useGlobalStore();
                let o;
                if(obj.event == "robot"){
                    o = obj.event;
                }else{
                    o = obj.event + obj.target;
                }
                if(globalStore.ws.events.has(o)){
                    let f = globalStore.ws.events.get(o);
                    f(obj);
                }
            }
            socket.onerror = (e) => {
                console.log(e);
                reject(e);
            }
            globalStore.ws.socket = socket;
        })
    }catch(err){
        console.error('connect failed',err);
    }
}

export function disConnect() {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    globalStore.ws.socket.close();
}

// 注册事件
export function subscribe(event: string, target: string, callback: Function) {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    globalStore.ws.events.set(event + target, callback);
    let obj = { event: "subscribe", option: event, target: target }
    console.log(obj);
    globalStore.ws.socket.send(JSON.stringify(obj));
}

// 取消注册
export function cancel_subscribe(event: string, target: string) {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    if(globalStore.ws.events.has(event + target)){
        globalStore.ws.events.delete(event + target);
        let obj = { event: "cancel_subscribe", option: event, target: target }
        globalStore.ws.socket.send(JSON.stringify(obj));
    }
}