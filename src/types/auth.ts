export interface UserDto {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: UserDto;
}
