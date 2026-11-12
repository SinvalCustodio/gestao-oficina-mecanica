import LoginForm from '../components/auth/LoginForm';

const Login = ({ onLogin }) => <LoginForm onLoginSuccess={onLogin} />;

export default Login;
