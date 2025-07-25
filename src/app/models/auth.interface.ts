// login.interface.ts
export interface Login {
    email: string;
    password: string;
}

// user.interface.ts ==> Please, adapt to your actual auth user shape
export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    fullname: string;
    roles: string[];
}

// login-error.interface.ts ==> Please, adapt to your actual backend response shape
export interface LoginError {
    code: number;
    message: string;
}

// login-success.interface.ts ==> Please, adapt to your actual backend response shape
export interface LoginSuccess {
    access_token: string;
    expires_in: number;
    not_before_policy: number;
    refresh_expires_in: number;
    refresh_token: string;
    scope: string;
    session_state: string;
    token_type: string;
}

// // login-response.type.ts
export type LoginResponse = LoginSuccess | LoginError;



// // core/auth/login/interfaces/index.ts
// export * from './login.interface';
// export * from './login-success.interface';
// export * from './login-error.interface';