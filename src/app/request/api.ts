import axios from 'axios';
import { createLoverRequest, LoverProfile } from '../types/request';

const url = 'http://localhost:8080/lovers/';
const wsUrl = 'ws://localhost:8080/lovers';

export async function createLover(data: createLoverRequest): Promise<LoverProfile> {
    var reqUrl = url+'create';
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
        const res = response.data as any;
        const loverProfile: LoverProfile = {
            id: res.id,
            userId: res.user_id,
            loverId: res.lover_id,
            name: res.name,
            image: res.image,  
            gender: res.gender,
            personality: res.personality,
            interests: res.hobbies,
            voiceStyle: res.talking_style
        };
        return loverProfile;
    } catch (error: any) {
        console.error('Error creating lover:', error);
        console.error('Error response data:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
}

export async function getLoverProfileList(user_id: string): Promise<LoverProfile[]> {
    var reqUrl = url+'list';
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
            image: item.image,  
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

export function connectToChat(
    userId: string,
    loverId: string,
    onMessage: (message: any) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
): WebSocket {
    const chatUrl = `${wsUrl}/chat/${userId}/${loverId}`;
    console.log('Connecting to WebSocket:', chatUrl);
    
    const ws = new WebSocket(chatUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected successfully');
    };
    
    ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
            const message = JSON.parse(event.data);
            onMessage(message);
        } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
            onMessage({ content: event.data });
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error details:', {
            type: error.type,
            message: error,
            url: ws.url,
            readyState: ws.readyState
        });
        onError?.(error);
    };
    
    ws.onclose = (event) => {
        console.log('WebSocket closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
        });
        onClose?.(event);
    };
    
    return ws;
}

export function sendChatMessage(ws: WebSocket, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    } else {
        console.error('WebSocket is not open');
    }
}

