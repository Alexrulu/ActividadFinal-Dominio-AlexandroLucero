export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

export function createUser(
  id: string,
  name: string,
  email: string,
  passwordHash: string,
  role: 'admin' | 'user' = 'user'
): User {
  return {
    id,
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash,
    role,
  };
}
