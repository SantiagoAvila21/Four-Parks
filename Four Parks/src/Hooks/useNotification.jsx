import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useNotification = (initialNotification) => {
    const defaultNotification = {
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
    };

    const [notification, setNotification] = useState({
        ...defaultNotification,
        ...initialNotification
    });

    const { type, message, position, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, progress, theme } = notification;

    useEffect(() => {
        if (type === 'error' || type === 'success' || type === 'info' || type === 'loading' ) {
            toast[type](message, {
                position,
                autoClose,
                hideProgressBar,
                closeOnClick,
                pauseOnHover,
                draggable,
                progress,
                theme
            });
        }
    }, [type, message, position, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, progress, theme]);

    const updateNotification = (newNotification) => {
        setNotification({
            ...notification,
            ...newNotification
        });
    };

    // Función para manejar la promesa y mostrar las notificaciones Toastify
    const closeNoti = () => {
        toast.dismiss();
    };

    return { updateNotification, closeNoti };
};

export default useNotification;
