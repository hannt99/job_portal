const checkPermission = (req, res, next, allowedRoles) => {
    const { role } = req.user;

    if (allowedRoles.includes(role)) {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized: Insufficient permissions',
        });
    }
};

export const isAdmin = (req, res, next) => {
    checkPermission(req, res, next, [2]);
};

export const isEmployer = (req, res, next) => {
    checkPermission(req, res, next, [0, 2]);
};

export const isCandidate = (req, res, next) => {
    checkPermission(req, res, next, [0, 1, 2]);
};
