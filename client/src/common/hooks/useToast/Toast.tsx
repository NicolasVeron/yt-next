'use client'

import React from "react"
import { Alert, Snackbar } from "@mui/material"
import type { AlertColor } from "@mui/material"

export interface ToastOptions {
    catchOnCancel?: boolean
    severity: AlertColor
    message: string
}

interface ToastProps extends ToastOptions {
    open: boolean
    onClose: () => void
}

export const Toast = ({severity, message, open, onClose}: ToastProps) => {

    const handleClose = () => {
        onClose()
    }

    if (!open) {
        return null
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Toast