// Direct Firebase authentication from a browser exposes reusable credentials.
// Referee clients must never upload, list, fetch, or delete storage objects with
// an administrator account. Keep this compatibility shim for old, currently
// unrouted widgets so an accidental re-enable fails closed.
class FirebaseStorageManager {
    static unavailable() {
        throw new Error("Direct Firebase storage access is disabled for referee accounts.");
    }

    static async authenticate() {
        return this.unavailable();
    }

    static async checkAuth() {
        return this.unavailable();
    }

    static async uploadFile() {
        return this.unavailable();
    }

    static async uploadString() {
        return this.unavailable();
    }

    static async getDownloadURL() {
        return this.unavailable();
    }

    static async deleteFile() {
        return this.unavailable();
    }

    static async listFiles() {
        return this.unavailable();
    }

    static async paginateFiles() {
        return this.unavailable();
    }
}

export default FirebaseStorageManager;
