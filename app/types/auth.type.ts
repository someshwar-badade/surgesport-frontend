// types/auth.types.ts
export interface User {
  id: string | number
  name: string
  email: string
  /**
   * Role identifier used for authorization.
   * 1 = Admin, 2 = Student, 3 = Researcher
   */
  role_id?: number
}

export interface LoginData {
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
  role_id?: number | string
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
