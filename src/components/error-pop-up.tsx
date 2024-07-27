import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorPopUp = ({
    error
} : {
    error: string
}) => {
    return (
        <button className="absolute flex items-center gap-2 left-8 bottom-8 bg-red-400 px-4 py-3 rounded-md fade-in-out">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <h1 className="font-semibold text-xl">{error}</h1>
        </button>
    );
}