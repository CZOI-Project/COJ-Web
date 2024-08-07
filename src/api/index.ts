import axios from "axios";
import { COJConfig } from "@/config";
import router from "@/router";
import { useGlobalStore } from "@/store/global";
import { useUserStore } from "@/store/user";
import { userLogoutService } from "./user";

const baseURL = COJConfig.baseURL;
const instance = axios.create({baseURL})

instance.interceptors.response.use(
    result=>{
        const globalStore = useGlobalStore()
        const userStore = useUserStore()
        //TODO tomcat有些异常不过全局异常处理，直接自行生成了返回结果
        const {code,message,data} = result.data;
        if(code === 200) return data;
        else if(code === 101){
            mdui.snackbar({
                message: '操作过于频繁，请稍后再试。'
            });
        }
        else if(code === 102){
            mdui.snackbar({
                message: message
            });
        }
        else if(code === 103){
            mdui.snackbar({
                message: '输入的内容不符合要求的格式。'
            });
        }
        else if(code === 104){
            mdui.snackbar({
                message: '权限不足。'
            });
        }
        else if(code === 100){
            return null;
        }
        else{
            // 其他错误，一般是无法预料的错误，拉起警告的弹窗
            globalStore.$patch({
                error_message:{
                    location: '客户端成功得到了服务端信息，但在解析时发生了错误。',
                    detail: '解析失败的内容：' + JSON.stringify(result.data)
                }
            })
            globalStore.error_message.show = true;
        }
        return Promise.reject(result.data);
    },
    err=>{
        const globalStore = useGlobalStore()
        const userStore = useUserStore()
        if(err.response){
            if(err.response.status===401){
                if(userStore.entry == null){
                    //未登录
                    router.push("/user/login");
                }
                else if(userStore.entry.type == 1){
                    //登录但是没有验证
                    router.push("/user/verify");
                }else{
                    //登录了，也验证了，令牌貌似没有过期，那可能是权限不足，被拦截器拦了
                    mdui.snackbar({
                        message: '权限不足。'
                    });
                }
            }
            else if(err.response.status===404){
                //404
                router.push("/404")
            }
            else if(err.response.status===500){
                globalStore.$patch({
                    error_message:{
                        location: '服务器发生了内部错误。',
                        detail: err.toJSON()
                    }
                })
                globalStore.error_message.show = true;
            }
            else if(err.response.status===412){
                //令牌无效或者已经过期
                mdui.snackbar({
                    message: '会话已经过期，请重新登录。'
                });
                userLogoutService();
                router.push('/user/login');
            }
            else{
                globalStore.$patch({
                    error_message:{
                        location: '服务器响应了未知的状态码：' + err.response.status +"。",
                        detail: err.toJSON()
                    }
                })
                globalStore.error_message.show = true;
            }
        }
        else if(err.request){
            mdui.snackbar({
                message: '网络连接错误(0)：' + err.toJSON()
            });
        }else{
            mdui.snackbar({
                message: '网络连接错误(1)：' + err.toJSON()
            });
        }
        return Promise.reject(err)
    }
)

instance.interceptors.request.use(
    (config)=>{
        const globalStore = useGlobalStore()
        const userStore = useUserStore()
        //请求时自动添加请求头
        if(userStore.token !== ''){
            config.headers.Authorization = userStore.token;
        }
        return config;
    },
    (err)=>{
        mdui.snackbar({
            message: '网络连接错误(3)：' + err.toJSON()
        });
        Promise.reject(err)
    }
)

export default instance;