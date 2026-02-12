/**
 * Generates a deterministic chat ID based on two user IDs.
 * This ensures both users always end up in the same "room" regardless of who initiates the chat.
 * @param {number|string} id1 
 * @param {number|string} id2 
 * @returns {string} 
 */
export const generateChatId = (id1, id2) => {
    const ids = [parseInt(id1), parseInt(id2)].sort((a, b) => a - b);
    return `${ids[0]}_${ids[1]}`;
};
