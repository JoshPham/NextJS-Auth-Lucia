"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const errorType = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "OAuthError":
                return "There was an issue with the OAuth provider.";
            case "InvalidRequest":
                return "Invalid request.";
            case "OAuth2RequestError":
                return "OAuth2 request error.";
            case "EmailInUse":
                return "An account is already associated with this email.";
            case "UserNotFound":
                return "User not found.";
            default:
                return "Something went wrong.";
        }
    };

    return (
        <div className="flex flex-col">
            <h1 className="font-semibold text-xl">Error</h1>
            <p>{getErrorMessage(errorType)}</p>
            <a href="/login">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go back to Login</button>
            </a>
        </div>
    );
}
