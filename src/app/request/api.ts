import axios from 'axios';
import { createLoverRequest, LoverProfile } from '../types/request';

const url = 'http://localhost:8080/lovers/';

export async function createLover(data: createLoverRequest): Promise<LoverProfile> {
    var reqUrl = url+'create';
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
            name: res.name,
            image: res.image,  
            gender: res.gender,
            personality: res.personality,
            interests: res.hobbies,
            voiceStyle: res.talking_style
        };
        return loverProfile;
    } catch (error) {
        console.error('Error creating lover:', error);
        throw error;
    }
}

export async function getLoverProfileList(loverId: string): Promise<LoverProfile[]> {
    var reqUrl = url+'list';
    try {
        const response = await axios({
            url: reqUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        console.log('Get lover profile list response:', response.data);
        const res = response.data as any;
        const loverProfiles: LoverProfile[] = res.map((item: any) => ({
            id: item.id,
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