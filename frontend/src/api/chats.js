const base_url = import.meta.env.VITE_API_BASE_URL;
export const getChats = async (userId) => {
    try {
        const response = await fetch(`${base_url}/api/chats?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user details')
        throw error;
    }
};

export const sendMessage = async (text, senderId, chatId) => {
    try {
        const response = await fetch(`${base_url}/api/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, senderId, chatId }),
        })
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error sending message');
        throw error;
    }
}

export const createChat = async (userId, recipient) => {
    try {
        const response = await fetch(`${base_url}/api/chats/new`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, recipient }),
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return data.error;
        }
    } catch (error) {
        console.error('Error creating chat', error);
        throw error;
    }
}