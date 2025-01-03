import { auth } from '../lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'firebase/auth';
import { User } from '../types/auth';
import type { AuthUser } from "../types/auth";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export const login = async ({ email, password }: { email: string; password: string }): Promise<AuthUser> => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    
    return {
        id: response.user.uid,
        displayName: response.user.displayName || '',
        email: response.user.email || '',
        avatar: response.user.photoURL || undefined,
        role: 'user',
    };
};

export async function register(data: RegisterData): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    // You might want to store additional user data in Firestore here
    return convertFirebaseUserToUser(userCredential);
}

export async function logout(): Promise<void> {
    await signOut(auth);
}

export async function isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

export async function loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return convertFirebaseUserToUser(userCredential);
}

// Remove the checkAuthStatus function as we'll use Firebase's onAuthStateChanged

export function onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            const user: User = {
                id: firebaseUser.uid,
                displayName: firebaseUser.displayName || 'User',
                email: firebaseUser.email!,
                avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}`,
                adoptedParishes: [],
                createdAt: new Date(firebaseUser.metadata.creationTime!),
                updatedAt: new Date(firebaseUser.metadata.lastSignInTime!)
            };
            callback(user);
        } else {
            callback(null);
        }
    });
}

function convertFirebaseUserToUser(userCredential: UserCredential): User {
    const firebaseUser = userCredential.user;
    return {
        id: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'User',
        email: firebaseUser.email!,
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}`,
        adoptedParishes: [],
        createdAt: new Date(firebaseUser.metadata.creationTime!),
        updatedAt: new Date(firebaseUser.metadata.lastSignInTime!)
    };
}