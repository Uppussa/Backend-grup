

export const verifyToken = (req, res, next) => { // Verificar token
    const bearerHeader = req.headers['authorization']; // Obtener token del header
    if (typeof bearerHeader !== 'undefined') { // Verificar si el token existe
        const bearer = bearerHeader.split(' '); // Separar el token del bearer
        const bearerToken = bearer[1]; // Obtener solo el token
        req.token = bearerToken; // Asignar token a la solicitud
        next(); // Continuar con la solicitud
    } else {
        res.sendStatus(403);
    }
};