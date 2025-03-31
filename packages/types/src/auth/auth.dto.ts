export interface loginAuthDto {
  email: string;
  password: string;
}

export interface registerAuthDto extends loginAuthDto {
  name: string;
}
