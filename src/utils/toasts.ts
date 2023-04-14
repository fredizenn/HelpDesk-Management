import { toasts } from 'svelte-toasts'

export const clearAllToast = () => {
    toasts.clearAll()
}

export const showSuccessToast = (message: string) => {
    clearAllToast()
    toasts.add({
        title: 'Success',
        description: message,
        theme: 'dark',
        placement: 'top-right',
        type: 'success',
        showProgress: true,
        duration: 3000
    })
}

export const showErrorToast = (message: string) => {
    clearAllToast()
    toasts.add({
        title: 'Error',
        description: message,
        theme: 'dark',
        placement: 'top-right',
        type: 'error',
        showProgress: true,
        duration: 3000
    })
}
