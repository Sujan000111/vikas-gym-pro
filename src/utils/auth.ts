export const ADMIN_CREDENTIALS = {
  email: 'admin@vikasgym.com',
  password: 'Admin@123',
} as const;

export function validateAdminLogin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
}
