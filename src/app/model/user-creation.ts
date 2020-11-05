export interface UserCreation {
  name: string;
  lastname: string;
  profile: string;
  specializations?: [string];
  firstImage?: File;
  secondImage?: File;
}
