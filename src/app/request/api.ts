import axios from 'axios';
import { createLoverRequest, LoverProfile } from '../types/request';

import io, { Socket } from 'socket.io-client';

const url = 'http://localhost:8080/lovers/';

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


export function sendChatMessage(ws: Socket, message: string): void {
    if (ws.connected) {
        ws.send(message);
    } else {
        console.error('WebSocket is not open');
    }
}

