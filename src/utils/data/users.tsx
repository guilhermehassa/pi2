import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { UserProps, LoginFormData } from '@/utils/types/users';

export async function authenticateUser({ user, password }: LoginFormData): Promise<UserProps | null> {
  try {
    const usersRef = collection(db, 'usuarios');
    const q = query(
      usersRef,
      where('user', '==', user),
      where('password', '==', password)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const userData = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      name: userData.name,
      user: userData.user,
      role: userData.role,
      phone: userData.phone || '',
      address: userData.address || {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    };
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return null;
  }
}

export async function getLoggedInUser(): Promise<UserProps | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }

    return JSON.parse(userStr) as UserProps;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<UserProps | null> {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      } as UserProps;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}