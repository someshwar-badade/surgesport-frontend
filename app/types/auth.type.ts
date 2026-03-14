// types/auth.types.ts
export interface User {
  id: string | number
  name: string
  email: string
  // add other user fields
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
