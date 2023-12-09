export const getDate = date => {
    const newDate = new Date(date.split('T')[0].split('-'));

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return newDate.toLocaleDateString('es-ES', options);
}

export const getNumericDate = date => {
    const newDate = new Date(date.split('T')[0].split('-'));
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1}-${newDate.getDay() < 10 ? '0' + newDate.getDay() : newDate.getDay()}`;
}