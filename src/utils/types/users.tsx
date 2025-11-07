export interface AddressProps {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserProps {
  id: string;
  name: string;
  user: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: AddressProps;
}

export interface LoginFormData {
  user: string;
  password: string;
}