export interface AuthUser {
  id: string;
  name: string;
  role: 'viewer' | 'manager' | 'admin';
}
