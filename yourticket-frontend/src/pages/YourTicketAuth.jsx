import { loginUser, registerUser } from "../api/api";

const handleLoginSubmit = async () => {
  const e = validateLogin();
  setErrors(e);
  if (Object.keys(e).length === 0) {
    try {
      const user = await loginUser(login.email, login.password);
      onLoginSuccess(user.userId, user.name);
    } catch (err) {
      setErrors({ password: err.message });
    }
  }
};

const handleSignupSubmit = async () => {
  const e = validateSignup();
  setErrors(e);
  if (Object.keys(e).length === 0) {
    try {
      await registerUser(signup.name, signup.email, signup.password);
      const user = await loginUser(signup.email, signup.password);
      onLoginSuccess(user.userId, user.name);
    } catch (err) {
      setErrors({ email: err.message });
    }
  }
};