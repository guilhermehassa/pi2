import { collection, query, where, getDocs } from 'firebase/firestore';
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
      role: userData.role
    };
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return null;
  }
}

export async function getLoggedInUser(): Promise<UserProps | null> {
  const userStr = localStorage.getItem('user');
  if(userStr){
    console.log(userStr)

    return userStr ? JSON.parse(userStr) as UserProps : null;
  }
  else{
    console.log('error');
    return null;
  }

  return null;
}