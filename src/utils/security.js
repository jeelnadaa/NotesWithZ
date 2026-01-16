
export const hashPassword = async (password) => {
    try {
        if (!crypto || !crypto.subtle) {
            console.error("Crypto API not available");
            return "insecure_fallback_" + btoa(password); // Fallback for dev/testing if crypto missing (unlikely but safe)
        }
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        console.error("Hashing failed", e);
        return null;
    }
};

export const verifyPassword = async (password, storedHash) => {
    try {
        const hash = await hashPassword(password);
        return hash === storedHash;
    } catch (e) {
        console.error("Verification failed", e);
        return false;
    }
};
