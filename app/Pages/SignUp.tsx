'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  otp: string;
  keepLoggedIn: boolean;
  date: string;
  
}

const LoginInterface: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'jonas_kahnwald@gmail.com',
    otp: '',
    keepLoggedIn: false,
    date: '',
  });
  const[isotp,setotp]=useState<boolean>(false)
  const [showOtp, setShowOtp] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleResendOtp = () => {
    console.log('Resending OTP...');
  };

  const handleCreateAccount = () => {
    console.log('Creating new account...');
  };
  const handleGoogleSignIn = () => {
    console.log('Signing in with Google...');
  };
  const onnextclick=()=>{
    if(!isotp){
      setotp(true);
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-500 mb-8">Please login to continue to your account.</p>

            <div className="space-y-6">
                <div>
                
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
        {isotp ? (
          <>
          <div>
  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
    Date
  </label>
  <input
    type="date"
    id="date"
    name="date"
    value={formData.date}
    onChange={handleInputChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
  />
</div>
       
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
              Sign up
            </button>
          </>
        ) : ( <button
              type="button"
              onClick={onnextclick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>)}
             

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