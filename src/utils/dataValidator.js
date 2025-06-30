const yup = require('yup');

const validateUser = async (data) => {
    return yup.object().shape({
        name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
        email: yup.string().email('Invalid email format').required('Email is required'),
        password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        photoURL: yup.string().url('Invalid URL format').optional(),
    }).validate(data, { abortEarly: false });
}

const validateEvent = async (data) => {
    return yup.object().shape({
        title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
        name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
        description: yup.string().optional(),
        dateTime: yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
        location: yup.string().required('Location is required'),
    }).validate(data, { abortEarly: false });
}

const validateLogin = async (data) => {
    return yup.object().shape({
        email: yup.string().email('Invalid email format').required('Email is required'),
        password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    }).validate(data, { abortEarly: false });
}

const dataValidator = {
    validateUser,
    validateEvent,
    validateLogin,
};

module.exports = dataValidator;