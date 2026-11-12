import { useState } from 'react';
import Icon from '../layout/Icon';
import { validateEmail, validatePassword } from '../../utils/validators';
import { loginUser } from '../../services/localStorageService';

const demoCredentials = {
  email: 'admin@oficina.com',
  password: 'Admin123'
};

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '' });
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, message: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError('');

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    setEmailValidation(emailResult);
    setPasswordValidation(passwordResult);

    if (!emailResult.isValid || !passwordResult.isValid) {
      setLoginError('Confira os campos indicados para continuar.');
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      const result = loginUser(email.trim(), password);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setLoginError(result.message.replace(/^❌\s*/, ''));
      }

      setIsLoading(false);
    }, 350);
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setEmailValidation(validateEmail(demoCredentials.email));
    setPasswordValidation(validatePassword(demoCredentials.password));
    setLoginError('');
  };

  return (
    <main className="login-screen">
      <section className="login-story" aria-label="Garagem+, gestão automotiva">
        <a className="login-brand brand-lockup" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark"><Icon name="wrench" size={20} /></span>
          <span className="brand-type"><strong>garagem<span>+</span></strong><small>GESTÃO AUTOMOTIVA</small></span>
        </a>

        <div className="story-content">
          <span className="eyebrow eyebrow-light">
            <span className="story-indicator" />
            GESTÃO INTELIGENTE PARA SUA OFICINA
          </span>
          <h1>Seu próximo<br />grande serviço<br />começa <span>por aqui.</span></h1>
          <p>Clientes, veículos e ordens de serviço em um só lugar. Mais organização para você focar no que importa: fazer acontecer.</p>

          <div className="story-showcase" aria-hidden="true">
            <div className="showcase-caption"><span>OFICINA EM MOVIMENTO</span><span>01 — 03</span></div>
            <div className="showcase-illustration">
              <div className="showcase-glow" />
              <div className="showcase-orbit showcase-orbit-one" />
              <div className="showcase-orbit showcase-orbit-two" />
              <svg className="showcase-car" viewBox="0 0 400 180" fill="none">
                <path d="m75 111 19-40c5-11 13-18 25-21l43-10c10-3 17-8 25-17l17-19c5-6 12-9 20-9h54c11 0 19 5 26 15l34 49 34 15c12 5 18 14 20 26l3 25H54l4-16c2-9 7-14 17-18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="m132 68 18-33c4-7 9-11 17-12l39-9-5 54h-69Zm81-54 42-1c8 0 14 4 19 11l29 42H209l4-52Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="m81 111 237 1m-167-57 60 1m21 0h62M66 126h22m226 1h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="119" cy="127" r="26" fill="#19211e" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="119" cy="127" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="300" cy="128" r="26" fill="#19211e" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="300" cy="128" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M56 96h30m259 1h20" stroke="#C9F27A" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="showcase-stamp"><Icon name="wrench" size={18} /><span>PRONTO<br />PRA RODAR</span></span>
            </div>
            <div className="showcase-progress"><span /></div>
          </div>
        </div>

        <div className="story-footer">
          <span>FEITO PARA QUEM FAZ ACONTECER.</span>
          <span>© GARAGEM+ 2026</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel-top"><span>ÁREA DA EQUIPE</span><span>01 <i>/</i> ACESSO</span></div>
        <div className="login-card">
          <span className="login-icon"><Icon name="wrench" size={21} /></span>
          <span className="eyebrow">BEM-VINDO DE VOLTA</span>
          <h2>Entre na sua conta</h2>
          <p className="login-description">Acesse o painel e acompanhe sua oficina de perto.</p>

          {loginError && (
            <div className="login-error" role="alert">
              <span className="login-error-mark">!</span>
              <span>{loginError}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>
              <div className="login-input-wrap">
                <Icon name="user" size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailValidation({ isValid: false, message: '' });
                    setLoginError('');
                  }}
                  placeholder="voce@suaoficina.com.br"
                  autoComplete="username"
                  required
                />
              </div>
              {emailValidation.message && !emailValidation.isValid && (
                <span className="field-message">{emailValidation.message.replace(/^⚠️\s*/, '')}</span>
              )}
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-password">Senha</label>
                <span className="login-field-hint">Sua senha de acesso</span>
              </div>
              <div className="login-input-wrap">
                <Icon name="lock" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordValidation({ isValid: false, message: '' });
                    setLoginError('');
                  }}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
              {passwordValidation.message && !passwordValidation.isValid && (
                <span className="field-message">{passwordValidation.message.replace(/^⚠️\s*/, '')}</span>
              )}
            </div>

            <button type="submit" className="login-submit" disabled={isLoading}>
              {isLoading ? 'Conectando...' : 'Entrar na oficina'}
              {!isLoading && <Icon name="arrow" size={18} />}
            </button>
          </form>

          <div className="demo-access">
            <div className="demo-access-copy">
              <span className="demo-access-icon"><Icon name="spark" size={16} /></span>
              <span><strong>Conhecendo a plataforma?</strong><small>Use a conta de demonstração</small></span>
            </div>
            <button type="button" className="demo-access-button" onClick={fillDemoCredentials}>
              Preencher acesso <Icon name="chevron" size={15} />
            </button>
          </div>

          <p className="login-privacy"><Icon name="shield" size={15} /> Acesso de demonstração · sessão armazenada neste navegador</p>
        </div>

        <div className="login-panel-footer"><span>ACESSO DA EQUIPE DA OFICINA</span><span>GESTÃO SEM COMPLICAÇÃO <Icon name="arrow" size={13} /></span></div>
      </section>
    </main>
  );
};

export default LoginForm;
