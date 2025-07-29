// login.class.ts
export class Login {
    email: string;
    password: string;
}

// user.class.ts ==> Please, adapt to your actual auth user shape
export class User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    fullname: string;
    roles: string[];
}

// login-error.class.ts ==> Please, adapt to your actual backend response shape
export class LoginError {
    code: number;
    message: string;
}

// login-success.class.ts ==> Please, adapt to your actual backend response shape
export class LoginSuccess {
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



// // core/auth/login/classs/index.ts
// export * from './login.class';
// export * from './login-success.class';
// export * from './login-error.class';