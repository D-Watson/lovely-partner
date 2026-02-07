export function getUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = `user-${Date.now()}`;
        localStorage.setItem('userId', userId); 
    }
    return userId;
}

export function getCurrentLoverId(): string | undefined {
    return localStorage.getItem('currentLoverId') || undefined;
}

export function setCurrentLoverId(loverId: string) {
    localStorage.setItem('currentLoverId', loverId);
}

export function clearCurrentLoverId() {
    localStorage.removeItem('currentLoverId');
}

export function clearLoverData(loverId: string) {
    localStorage.removeItem(`messages_${loverId}`);
    localStorage.removeItem(`lastCareDate_${loverId}`);
}

export function clearAllLoverData() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('messages_') || key.startsWith('lastCareDate_')) {
            localStorage.removeItem(key);
        }
    });
}

export function clearUserId() {
    localStorage.removeItem('userId');
}

export function clearAllData() {
    localStorage.clear();
}

export function setLoverMessages(loverId: string, messages: any[]) {
    localStorage.setItem(`messages_${loverId}`, JSON.stringify(messages));
}

export function getLoverMessages(loverId: string): any[] {
    const messages = localStorage.getItem(`messages_${loverId}`);
    return messages ? JSON.parse(messages) : [];
}

export function setLastCareDate(loverId: string, date: string) {
    localStorage.setItem(`lastCareDate_${loverId}`, date);
}

export function getLastCareDate(loverId: string): string | null {
    return localStorage.getItem(`lastCareDate_${loverId}`);
}

export function getLoverProfileFromStorage(loverId: string): any | null {
    const profile = localStorage.getItem(`profile_${loverId}`);
    return profile ? JSON.parse(profile) : null;
}

export function setLoverProfileToStorage(loverId: string, profile: any) {
    localStorage.setItem(`profile_${loverId}`, JSON.stringify(profile));
}

export function clearLoverProfileFromStorage(loverId: string) {
    localStorage.removeItem(`profile_${loverId}`);
}