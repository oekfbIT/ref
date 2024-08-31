import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, list, uploadString } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { storage } from './firebaseConfig';

const EMAIL = "admin@oekfb.eu";  // Hardcoded email
const PASSWORD = "hY-q2Giapxzng";        // Hardcoded password

class FirebaseStorageManager {
    static auth = getAuth();

    static async authenticate() {
        if (!this.auth.currentUser) {
            try {
                await signInWithEmailAndPassword(this.auth, EMAIL, PASSWORD);
                console.log("User authenticated successfully.");
            } catch (error) {
                console.error("Error authenticating user: ", error);
                throw error;
            }
        }
    }

    static async checkAuth() {
        if (!this.auth.currentUser) {
            await this.authenticate();
        }
    }

    static getFileSuffix(fileType) {
        switch (fileType) {
            case 'application/pdf':
                return 'pdf';
            case 'image/png':
                return 'png';
            case 'image/jpeg':
                return 'jpeg';
            default:
                return 'unknown';
        }
    }

    static async uploadFile(file, path, filename) {
        try {
            await this.checkAuth();
            const fileSuffix = this.getFileSuffix(file.type);
            const storageRef = ref(storage, `${path}/${filename}.${fileSuffix}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);
            return fileUrl;
        } catch (error) {
            console.error("Error uploading file: ", error);
            throw error;
        }
    }

    static async uploadString(content, path, fileName, format = 'raw') {
        try {
            await this.checkAuth();
            const storageRef = ref(storage, `${path}/${fileName}`);
            await uploadString(storageRef, content, format);
            const fileUrl = await getDownloadURL(storageRef);
            return fileUrl;
        } catch (error) {
            console.error("Error uploading string: ", error);
            throw error;
        }
    }

    static async getDownloadURL(path) {
        try {
            await this.checkAuth();
            const storageRef = ref(storage, path);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error("Error getting download URL: ", error);
            throw error;
        }
    }

    static async deleteFile(path) {
        try {
            await this.checkAuth();
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file: ", error);
            throw error;
        }
    }

    static async listFiles(path) {
        try {
            await this.checkAuth();
            const listRef = ref(storage, path);
            const res = await listAll(listRef);
            const files = res.items.map(itemRef => ({
                name: itemRef.name,
                fullPath: itemRef.fullPath
            }));
            return files;
        } catch (error) {
            console.error("Error listing files: ", error);
            throw error;
        }
    }

    static async paginateFiles(path, maxResults, pageToken = null) {
        try {
            await this.checkAuth();
            const listRef = ref(storage, path);
            const options = { maxResults };
            if (pageToken) {
                options.pageToken = pageToken;
            }
            const res = await list(listRef, options);
            const files = res.items.map(itemRef => ({
                name: itemRef.name,
                fullPath: itemRef.fullPath
            }));
            return {
                files,
                nextPageToken: res.nextPageToken
            };
        } catch (error) {
            console.error("Error paginating files: ", error);
            throw error;
        }
    }
}

export default FirebaseStorageManager;
