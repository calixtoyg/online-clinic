export interface UserCreation {
  name: string;
  lastname: string;
  profile: string;
  email?: string;
  specializations?: string[];
  firstImage?: File;
  secondImage?: File;
}
