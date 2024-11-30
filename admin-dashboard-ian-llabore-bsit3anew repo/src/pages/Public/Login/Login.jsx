import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);

        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
  
    try {
      const response = await axios.post('http://localhost/movieproject-api/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the raw response data to see the full string
      console.log('Full Response:', response.data);
  
      // Extract the JSON part from the response string
      const jsonString = response.data.match(/{.*}/s); // Matches everything inside the first curly braces
      if (jsonString) {
        const parsedResponse = JSON.parse(jsonString[0]); // Safely parse the matched JSON string
  
        console.log('Parsed Response:', parsedResponse);
  
        if (parsedResponse && parsedResponse.access_token) {
          console.log('Saving token:', parsedResponse.access_token);
          localStorage.setItem('accessToken', parsedResponse.access_token);
          console.log('Stored token in localStorage:', localStorage.getItem('accessToken'));
          navigate('/main/movies');
        } else {
          setError('Token not found');
          alert('Login failed, token not found.');
        }
      } else {
        console.log('Invalid response format:', response.data);
        setError('Invalid response format');
        alert('Login failed, invalid response format.');
      }
  
      setStatus('idle');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred');
      setStatus('idle');
    }
  };
  
  
  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Login'>
      <div className='main-container'>
        <form>
          <div className='form-container'>
            <h3>Login</h3>

            {error && <span className='login errors'>{error}</span>}
            <div>
              <div className='form-group'>
                <label>E-mail:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && email == '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div>
              <div className='form-group'>
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && password == '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className='submit-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') {
                    return;
                  }
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email == '') {
                      emailRef.current.focus();
                    }

                    if (password =='') {
                      passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading'}
              </button>
            </div>
            <div className='register-container'>
              <a href='/register'>
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;