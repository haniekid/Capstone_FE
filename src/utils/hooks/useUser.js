import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getUser, login } from "../../store/actions/userActions";
import { selectCurrentUser, selectError, selectIsLoading, selectToken, setUser } from "../../store/reducers/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Check for stored token on initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const getUsersHandler = async () => {
    await dispatch(getUsers());
  };

  const getUserHandler = async (userId) => {
    await dispatch(getUser(userId));
  };

  const loginHandler = async (loginData) => {
    try {
      const response = await dispatch(login(loginData));
      if (response.payload && response.payload.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.payload.token);
        
        // Create user object from token claims
        const tokenData = JSON.parse(atob(response.payload.token.split('.')[1]));
        const user = {
          userID: tokenData.nameid,
          firstName: tokenData.unique_name,
          lastName: tokenData.family_name,
          email: tokenData.email,
          phone: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
          address: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress'],
          city: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality'],
          postalCode: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode'],
          roleName: tokenData.role,
          token: response.payload.token
        };
        
        // Store user in localStorage and Redux
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUser(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(setUser(null));
  };
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return { 
    getUsers: getUsersHandler, 
    getUser: getUserHandler, 
    login: loginHandler,
    logout: logoutHandler,
    token, 
    currentUser, 
    isLoading, 
    error 
  };
};
