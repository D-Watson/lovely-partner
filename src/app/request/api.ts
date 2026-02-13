import axios from 'axios';
// axios请求拦截器：自动添加userId和token到请求头，排除登录和注册
// axios.interceptors.request.use(config => {
//     const userInfo = localStorage.getItem('user-info');
//     if (!userInfo){
//         return config;
//     }
//     const user = JSON.parse(userInfo);
//     const userId = user.user_id;
//     const token = user.token;
//     // 排除登录和注册接口
//     if (
//         config.url &&
//         !config.url.includes('/user/login') &&
//         !config.url.includes('/user/register') &&
//         !config.url.includes('/user/send_email_code') &&
//         userId && token
//     ) {
//         config.headers = {
//             ...config.headers,
//             'x-user-id': userId,
//             'x-token': token
//         };
//     }
//     return config;
// }, error => Promise.reject(error));
import { createLoverRequest, LoverProfile } from '../types/request';
import { Message, UserLoginRes, UserRegisterRes} from '../types/request';
import { Socket } from 'socket.io-client';

const url = 'http://localhost:8080/';

export async function createLover(data: createLoverRequest): Promise<LoverProfile> {
    var reqUrl = url+'lovers/create';
    console.log('Creating lover with data:', data);
    try {
        const response = await axios({
            url: reqUrl,
            method: 'POST',
            data: data,
            headers: {
            'Content-Type': 'application/json',
            'x-user-id': data.user_id,
            'x-token': localStorage.getItem('token')
            },
        })
        console.log('Create lover response:', response.data);
        if(!response.data){
            throw new Error('API error: No response data');
        }
        const res = response.data as any;
        if(res['code'] !== 200){
            throw new Error(`API error: ${res['message'] || 'Unknown error'}`);
        }
        const resData = res.data as any;
        const loverProfile: LoverProfile = {
            id: resData.id,
            userId: resData.user_id,
            loverId: resData.lover_id,
            name: resData.name,
            image: resData.image,  
            gender: resData.gender,
            personality: resData.personality,
            interests: resData.hobbies,
            voiceStyle: resData.talking_style
        };
        return loverProfile;
    } catch (error: any) {
        console.error('Error creating lover:', error);
        console.error('err=', error.Content)
        throw error;
    }
}

export async function getLoverProfile(user_id: string, lover_id: string, prompt: string): Promise<string> {
    var reqUrl = url+'images/upload';
    console.log('Getting lover profile for user_id:', user_id, 'lover_id:', lover_id, 'prompt:', prompt);
    try {
        const response = await axios({
            url: reqUrl,
            method: 'POST',
            data: { 
                user_id: user_id,
                lover_id: lover_id,
                prompt: prompt
            },
            headers: {
            'Content-Type': 'application/json',
            'x-user-id': user_id,
            'x-token': localStorage.getItem('token')
            },
        })
        const res = response.data as any;
        console.log('Get lover profile response:', res);
        if(res['code'] !== 200){
            throw new Error(`API error: ${res['message'] || 'Unknown error'}`);
        }
        const resData = res.data as any;
        const imageUrl = resData.avatar;
        return imageUrl;
    } catch (error) {
        console.error('Error getting lover profile:', error);
        throw error;
    }
}

export async function getLoverProfileList(user_id: string): Promise<LoverProfile[]> {
    var reqUrl = url+'lovers/list';
    console.log('Getting lover profile list for user_id:', user_id);
    try {
        const response = await axios({
            url: reqUrl,
            method: 'GET',
            params: { 
                user_id: user_id
            },
            headers: {
            'x-user-id': user_id,
            'x-token': localStorage.getItem('token')  
            }  
        })
        console.log('Get lover profile list response:', response.data);
        const res = response.data as any;
        const loverProfiles: LoverProfile[] = res.data.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            loverId: item.lover_id,
            name: item.name,
            image: item.avatar,  
            gender: item.gender,
            personality: item.personality,
            interests: item.hobbies,
            voiceStyle: item.talking_style
        }));
        return loverProfiles;
    } catch (error) {
        console.error('Error getting lover profile list:', error);
        throw error;
    }
}

export function deleteLover(user_id: string, lover_id: string): Promise<void> {
    var reqUrl = url+'lovers/delete';
    return new Promise<void>(async (resolve, reject) => {
        try {
            await axios({
                url: reqUrl,
                method: 'POST',
                data: { 
                    user_id: user_id,
                    lover_id: lover_id
                },
                headers: {
                'Content-Type': 'application/json',
                'x-user-id': user_id,
                'x-token': localStorage.getItem('token')   
                },
            });
            resolve();
        } catch (error) {
            console.error('Error deleting lover:', error);
            reject(error);
        }
    });
}


export function sendChatMessage(ws: Socket, message: string): void {
    if (ws.connected) {
        ws.send(message);
    } else {
        console.error('WebSocket is not open');
    }
}


export async function getLoverMessages(user_id: string, lover_id: string): Promise<Message[]> {
    var reqUrl = url+'lovers/history';
    console.log('Getting lover messages for user_id:', user_id, 'lover_id:', lover_id);
    try {
        const response = await axios({
            url: reqUrl,
            method: 'GET',
            params: { 
                user_id: user_id,
                lover_id: lover_id,
            },
            headers: {
                'x-user-id': user_id,
                'x-token': localStorage.getItem('token')
            }
        })
        const res = response.data as any;
        console.log('Get lover profile response:', res);
        if(res['code'] !== 200){
            throw new Error(`API error: ${res['message'] || 'Unknown error'}`);
        }
        const resData = res.data as any;
        const messages: Message[] = resData.map((item: any) => ({
            id: item.id,
            sender: item.sender === 'human' ? 'human' : 'ai',
            content: item.content,
            timestamp: new Date(item.timestamp),
            type: item.type === 'care' ? 'care' : 'text'
        }));
        return messages;
    } catch (error) {
        console.error('Error getting lover messages:', error);
        throw error;
    }
}

export async function login(email: string, password: string): Promise<UserLoginRes> {
    var reqUrl = url+'user/login';
        try {
            const response = await axios({
                url: reqUrl,
                method: 'POST',
                data: { 
                    email: email,
                    password: password
                },
                headers: {
                'Content-Type': 'application/json'      
                },
            });
            const res = response.data as any;
            if(res['code'] === 200){
                const resData = res.data as any;
                const loginRes: UserLoginRes = {
                    user_id: resData.user_id,
                    username: resData.username,
                    token: resData.token
                };
                return loginRes;
            } else {
                throw new Error(`Login failed: ${res['message'] || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
}

export async function register(username: string, password: string, email: string = '', code: string = ''): Promise<UserRegisterRes> {
    var reqUrl = url+'user/register';
    
        try {
            const response = await axios({
                url: reqUrl,
                method: 'POST',
                data: { 
                    username: username,
                    email: email,
                    password: password,
                    email_token: code
                },
                headers: {
                'Content-Type': 'application/json'      
                },
            });
            const res = response.data as any;
            console.log('Register response:', res);
            if(res['code'] === 200){
                const resData = res.data as any;
                const registerRes: UserRegisterRes = {
                    user_id: resData.user_id,
                    username: resData.username,
                    msg: res['msg'],
                    code: res['code']
                };
                return registerRes;
            } else {
                const registerRes: UserRegisterRes = {
                    user_id: '',
                    username: '',
                    msg: res['msg'],
                    code: res['code']
                };
                return registerRes;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
}


export async function sendCode(email: string): Promise<boolean> {
    var reqUrl = url+'user/send_email_code';
    try{
        const response = await axios({
            url: reqUrl,
            method: 'POST',
            data: { 
                email: email
            },
            headers: {
            'Content-Type': 'application/json'      
            },
        });
        const res = response.data as any;
        console.log('Send code response:', res);
        if(res['code'] === 200 && res['data'] === true){
            return true;
        } 
    } catch (error) {   
        console.error('Error sending code:', error);
        return false;
    }
    return false;
}