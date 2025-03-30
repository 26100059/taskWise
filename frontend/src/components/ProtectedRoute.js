import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectAuthToken } from '../redux/slices/authSlice';

const ProtectedRoute = () => {
    const token = useSelector(selectAuthToken);
    const location = useLocation();
  
    // Debugging log
    console.log('[ProtectedRoute] Auth status:', token ? 'Authenticated' : 'Unauthenticated');
  
    if (!token) {
      // Preserve current location for post-login redirect
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }
  
    return <Outlet />;
  };

export default ProtectedRoute;


// import { useSelector } from 'react-redux';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { selectAuthToken, selectCurrentUser } from '../redux/slices/authSlice';

// const ProtectedRoute = () => {
//   const token = useSelector(selectAuthToken);
//   const user = useSelector(selectCurrentUser);
//   const location = useLocation();

//   if (!token || !user) {
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

