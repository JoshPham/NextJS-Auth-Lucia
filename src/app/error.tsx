"use client";

export default function error ({
    error,
    reset
}: {
    error: Error,
    reset: () => void
}) {

    return (
        <div className="flex flex-col">
            <h1 className="font-semibold text-xl">Error</h1>
            <p>Something went wrong</p>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
