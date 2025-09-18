import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export async function handleApiRequest<T>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> {
    try {
        const result = await fn();

        if (successMessage) {
            Toast.show({
                type: "success",
                text1: "Éxito",
                text2: successMessage,
            });
        }

        return result
    } catch (error) {
        let message = "Ocurrió un error inesperado";

        if (error instanceof AxiosError) {
            if (error.response) {
                message = error.response.data?.message || `Error ${error.response.status}`;
            } else if (error.request) {
                message = "No se pudo conectar con el servidor";
            }
        }

        Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
        });

        return null;
    }
}
