import { jwtDecode } from 'jwt-decode';

const checkAuth = (token) => {
    if (!token) {
        return { authenticated: false };
    }

    const decodedToken = jwtDecode(token);
    const currentDate = new Date();
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        return { authenticated: false };
    }

    return { authenticated: true, role: decodedToken?.role };
};

export default checkAuth;
