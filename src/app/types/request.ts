export interface postLogData{
  package_name: string,
  user_id: string,
  client_id: string,
  client_id_type: string,
  retrieval_id: string
}

export interface createLoverRequest{
    user_id: string,
    lover_id: string,
    avatar: string,
    name: string,
    gender: number,
    personality: number,
    hobbies: number[],
    talking_style: number
}

export interface LoverProfile {
  id: string;
  userId: string;
  loverId:string
  name: string;
  image?: string;
  gender: number;
  personality: number;
  interests: string[];
  voiceStyle: number;
}
export interface LoverBase{
  lover_id:string,
  user_id:string
}