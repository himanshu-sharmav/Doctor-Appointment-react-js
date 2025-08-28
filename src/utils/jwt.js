import jwtDecode from "jwt-decode"

export const decodeToken = (token) =>{
    return jwtDecode(token);
}

export const getToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('accessToken');
}