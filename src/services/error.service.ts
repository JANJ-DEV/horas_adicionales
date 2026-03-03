// errorService.ts

import { FirebaseError } from 'firebase/app'; // O 'firebase/auth', 'firebase/firestore', etc.

/**
 * Traduce un código de FirebaseError a un mensaje amigable para el usuario.
 * @param errorCode El código del error de Firebase (ej. 'auth/invalid-email').
 * @returns Un mensaje de error localizado y amigable.
 */
function getFriendlyFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    // Errores de autenticación
    case 'auth/invalid-email':
      return 'El formato del correo electrónico es inválido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado.';
    case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/network-request-failed':
        return 'Hubo un problema de conexión a la red. Por favor, inténtalo de nuevo.';
    case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.';

    // Errores de Firestore (ejemplos)
    case 'firestore/permission-denied':
      return 'No tienes permiso para realizar esta operación.';
    case 'firestore/unavailable':
      return 'El servicio de base de datos no está disponible. Inténtalo de nuevo.';
    case 'firestore/not-found':
      return 'El documento solicitado no existe.';

    // Otros errores comunes
    default:
      return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
  }
}

/**
 * Manejador centralizado de errores de la aplicación.
 * @param error El objeto de error capturado.
 * @param context Opcional: información adicional sobre dónde ocurrió el error.
 */
export function handleAppError(error: unknown, context?: string): void {
  if (error instanceof FirebaseError) {
    const friendlyMessage = getFriendlyFirebaseErrorMessage(error.code);
    console.error(`FirebaseError en ${context || 'contexto desconocido'}: [${error.code}] ${error.message}`, friendlyMessage);
    // Aquí puedes:
    // 1. Mostrar el mensaje amigable al usuario (ej. usando un toast, modal, etc.)
     //   alert(friendlyMessage); // O una UI más sofisticada
    // 2. Enviar el error a un servicio de logging/monitoreo
    //    myErrorMonitoringService.log(error, { context, friendlyMessage });
  } else if (error instanceof Error) {
    console.error(`Error general en ${context || 'contexto desconocido'}: ${error.message}`);
    // Aquí puedes manejar otros tipos de errores JavaScript estándar
    // myErrorMonitoringService.log(error, { context });
  } else {
    console.error(`Error desconocido en ${context || 'contexto desconocido'}:`, error);
    // myErrorMonitoringService.log(new Error('Unknown error'), { context, originalError: error });
  }

  // Opcional: siempre mostrar un mensaje genérico al usuario si no se manejó específicamente
  // if (!errorHandledForUser) { showGenericErrorMessage(); }
}

