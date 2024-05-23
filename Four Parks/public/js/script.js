const menuItems = document.querySelectorAll('.menu-item');
const features = document.getElementById('features');
const image = document.getElementById('image');

const contentMap = {
    explora: {
        text: `
            <p>Sumérgete en nuestra plataforma web para descubrir todas las funcionalidades que tenemos para ofrecerte. Desde aquí podrás acceder a nuestros servicios de manera rápida y sencilla.</p>
        `,
        imgSrc: 'img/explora.jpg',
        imgAlt: 'Imagen de Explorar'
    },
    registrate: {
        text: `
            <p>Con nuestro sistema, puedes reservar tu cupo de manera anticipada, garantizando tu espacio y agilizando el proceso de ingreso. Ya no tendrás que preocuparte por encontrar lugar, pues podrás asegurar tu espacio desde la comodidad de tu dispositivo móvil o computadora.</p>
        `,
        imgSrc: 'img/register.jpg',
        imgAlt: 'Imagen de Ahorra tiempo y dinero'
    },
    seguridad: {
        text: `
            <p>Accede a tu cuenta de manera segura utilizando tus credenciales. Nuestro sistema de inicio de sesión garantiza la protección de tu información personal.</p>
        `,
        imgSrc: 'img/seguridad.png',
        imgAlt: 'Imagen de Información en tiempo real'
    },
    experiencia: {
        text: `
            <p>Después de tu primer inicio de sesión, personaliza tu cuenta según tus preferencias. Desde ajustes de seguridad hasta preferencias de notificación, tú tienes el control.</p>
        `,
        imgSrc: 'img/experiencia.jpg',
        imgAlt: 'Imagen de Soporte y personalización'
    },
    funcionalidades: {
        text: `
            <p>Descubre todas las funcionalidades que ofrecemos para facilitar tu experiencia de estacionamiento. Desde reservas anticipadas hasta seguimiento en tiempo real, estamos aquí para simplificar tu vida.</p>
        `,
        imgSrc: 'img/funcionalidades.png',
        imgAlt: 'Imagen de Facturación electrónica'
    },
    reservas: {
        text: `
            <p>Utiliza nuestra plataforma para reservar tu espacio de estacionamiento deseado. Con solo unos clics, asegura tu lugar para tu vehículo o moto.</p>
        `,
        imgSrc: 'img/reservas.png',
        imgAlt: 'Imagen de Ahorra tiempo y dinero'
    },
    disfruta: {
        text: `
            <p>Una vez registrado y listo para usar, aprovecha al máximo nuestro sistema de estacionamiento. Simplifica tus desplazamientos diarios y disfruta de una experiencia sin complicaciones.</p>
        `,
        imgSrc: 'img/logo.png',
        imgAlt: 'Imagen de Notificaciones automáticas'
    }
};

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all menu items
        menuItems.forEach(item => item.classList.remove('active'));
        // Add active class to the clicked menu item
        item.classList.add('active');
        // Update the content and image based on the clicked menu item
        const contentKey = item.getAttribute('data-content');
        features.innerHTML = contentMap[contentKey].text;
        features.classList.add('large-text'); // Add the class to increase text size
        image.src = contentMap[contentKey].imgSrc;
        image.alt = contentMap[contentKey].imgAlt;
    });
});

// Set initial class for the features section
features.classList.add('large-text');
