export const OAuth2RequestErrorResponse = new Response(null, {
    status: 302,
    headers: {
        Location: "/login/error?error=OAuth2RequestError"
    }
});

export const EmailInUseErrorResponse = new Response(null, {
    status: 302,
    headers: {
        Location: "/login/error?error=EmailInUse"
    }
});

export const InternalServerErrorResponse = new Response(null, {
    status: 302,
    headers: {
        Location: "/login/error?error=InternalServerError"
    }
});

export const InvalidCredentialsErrorResponse = new Response(null, {
    status: 302,
    headers: {
        Location: "/login/error?error=InvalidCredentials"
    }
});