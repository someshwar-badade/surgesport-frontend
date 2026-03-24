
// types/auth.types.ts
export interface User {
  id: number
  name: string
  email: string
  /**
   * Role identifier used for authorization.
   * 1 = Admin, 2 = Student, 3 = Researcher
   */
  role_id?: number
}

export interface UserRole {
  id: number;
  name?: string;
  display_name?: string;
}

export interface UserWithRole {
  id:  number
  name: string
  email: string
  role?: UserRole
  created_at? : string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterData {
  name?: string
  email: string
  password: string
  password_confirmation?: string
  role?: string
}

export interface UserUpdateData {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  role?: number | string
}

export interface RegisterResponse {
  user: User
  token: string
}

export interface AuthContextType {
  user: User | null
  login: (userData: LoginResponse) => void
  logout: () => void
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
    message?: string
  }
  message?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}


export interface UserCreate {
  email: string
  token: string
  password: string
  password_confirmation: string
}
