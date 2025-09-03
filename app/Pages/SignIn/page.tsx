'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  otp: string;
  keepLoggedIn: boolean;
}

const LoginInterface: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'jonas_kahnwald@gmail.com',
    otp: '',
    keepLoggedIn: false
  });
  
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [isotp, setotp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear email error when user types
    if (name === 'email') {
      setEmailError('');
      setEmailMessage('');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.email, 
        otp: formData.otp 
      })
    })

    const result = await response.json()

    if (result.success) {
      console.log('Login successful:', result.user)

      router.push(`/Pages/Dashboard/${result.user.id}`)
    } else {
      setEmailError(result.message)
    }
  } catch (error) {
    console.error('Login error:', error)
    setEmailError('Network error. Please try again.')
  } finally {
    setLoading(false)
  }
}
  const handleResendOtp = () => {
    console.log('Resending OTP...');
  };

  const handleCreateAccount = () => {
    console.log('Creating new account...');
  };

  const handleGoogleSignIn = () => {
    console.log('Signing in with Google...');
  };

  const onnextclick = async () => {
    if (!isotp) {
      // Log the email first
      console.log('Email entered by user:', formData.email);
      
      // Frontend validation first
      if (!formData.email.trim()) {
        setEmailError('Email is required');
        return;
      }

      if (!validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      setLoading(true);
      setEmailError('');
      setEmailMessage('');

      try {
        const response = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email })
        });

        const result = await response.json();

        if (result.valid) {
          if (result.userExists) {
            // User exists - proceed to OTP step
            setEmailMessage(result.message);
            setotp(true);
            // Here you would typically trigger OTP sending
          } else {
            // User doesn't exist - show signup option
            setEmailError(result.message);
            // Optionally auto-redirect to signup after a delay
            setTimeout(() => {
              router.push('/Pages/SignUp');
            }, 2000);
          }
        } else {
          setEmailError(result.message);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const onsignupclick = () => {
    router.push('/Pages/SignUp');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex-1 p-16 flex flex-col justify-center relative border-2 border-dashed border-gray-200 m-6 rounded-2xl">
          <div className="absolute top-8 left-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="font-semibold text-gray-700">HD</span>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500 mb-8">Please login to continue to your account.</p>

            <div className="space-y-6">
              <div className='mb-12'>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isotp}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  } ${isotp ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                {emailMessage && (
                  <p className="text-green-600 text-sm mt-1">{emailMessage}</p>
                )}
              </div>

              {isotp ? (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      OTP
                    </label>
                    <div className="relative">
                      <input
                        type={showOtp ? 'text' : 'password'}
                        id="otp"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter OTP"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOtp(!showOtp)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="keepLoggedIn"
                      name="keepLoggedIn"
                      checked={formData.keepLoggedIn}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
                      Keep me logged in
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onnextclick}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} />
                      Checking...
                    </>
                  ) : (
                    'Next'
                  )}
                </button>
              )}

              <div className="text-center text-gray-400">- Or -</div>

              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <img 
                  src="/google1.svg" 
                  alt="Google logo" 
                  className="w-5 h-5 mr-2" 
                />
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="flex flex-row text-sm text-gray-500 text-center m-12">
            <div className="text-gray-500 text-center mx-1">Don't have an account?</div>
            <div className='text-blue-500 cursor-pointer hover:text-blue-600' onClick={onsignupclick}>
              <p>signup</p> 
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/container.svg" 
              alt="Flowing design"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginInterface;