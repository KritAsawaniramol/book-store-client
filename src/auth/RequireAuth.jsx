import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';

export default function RequireAuth({ children, role }) {
    const { roleID } = useAuth()
    if (!role.includes(roleID)) {
        return <Navigate to="/error" replace />;
    }
    return children;
}

RequireAuth.propTypes = {
    children: PropTypes.element,
    role: PropTypes.array
}
