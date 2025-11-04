export interface UserProps {
  id: string;
  name: string;
  user: string;
  role: 'admin' | 'user';
}

export interface LoginFormData {
  user: string;
  password: string;
}