import axios from 'axios';
import { createLoverRequest, LoverProfile } from '../types/request';
import { Message} from '../types/request';
import { Socket } from 'socket.io-client';

const url = 'http://localhost:8000/';

export async function createLover(data: createLoverRequest): Promise<LoverProfile> {
    var reqUrl = url+'lovers/create';
    console.log('Creating lover with data:', data);
    try {
        const response = await axios({
            url: reqUrl,
            method: 'POST',
            data: data,
            headers: {
            'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'      
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
