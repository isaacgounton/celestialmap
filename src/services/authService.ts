import { auth } from '../lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { User } from "../types/User";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
    );

    return convertFirebaseUserToUser(userCredential);
}

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

function convertFirebaseUserToUser(userCredential: UserCredential): User {
    const firebaseUser = userCredential.user;
    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email!,
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}`,
        adoptedParishes: [],
        createdAt: new Date(firebaseUser.metadata.creationTime!),
        updatedAt: new Date(firebaseUser.metadata.lastSignInTime!)
    };
}