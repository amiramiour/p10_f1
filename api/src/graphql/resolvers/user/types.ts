export interface CreateUserArgs {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  }
  
  export interface LoginUserArgs {
    email: string;
    password: string;
  }
 export interface UpdateUserArgs {
  firstname?: string;
  lastname?: string;
  password?: string;
}

export interface DeleteUserArgs {
  id: string;
}
 