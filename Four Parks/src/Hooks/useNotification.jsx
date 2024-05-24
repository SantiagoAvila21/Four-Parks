import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useNotification = () => {
    /* const defaultNotification = {
        type: "",
        message: "",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    }; */

    const [notification, setNotification] = useState(null);

    const showNotification = (newNotification) => {
        const { type, message, position, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, progress, theme } = newNotification;
        const key = Date.now().toString(); // Genera un identificador único basado en la marca de tiempo
        toast[type](message, {
            key, // Usa el identificador como clave para forzar la creación de una nueva notificación
            position,
            autoClose,
            hideProgressBar,
            closeOnClick,
            pauseOnHover,
            draggable,
            progress,
            theme,
            onClose: () => {
                // Reinicia la variable de estado cuando se cierra la notificación
                setNotification(null);
            }
        });
    };

    const updateNotification = (newNotification) => {
        // Si ya hay una notificación en curso, forzamos la creación de una nueva notificación
        if (notification) {
            const newMessage = `¡${newNotification.message}!`;
            newNotification = { ...newNotification, message: newMessage };
        }
        setNotification(newNotification);
    };
    

    useEffect(() => {
        if (notification) {
            showNotification(notification);
        }
    }, [notification]);

    const closeNoti = () => {
        toast.dismiss();
    };

    return { updateNotification, closeNoti };
};


export default useNotification;
