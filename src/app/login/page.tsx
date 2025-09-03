'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/authContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');
  
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for redirect parameter
  useEffect(() => {
    const nextUrl = searchParams.get('next');
    if (nextUrl) {
      setRedirectMessage(t('auth.redirect_message'));
    }
  }, [searchParams, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      
      // Check for redirect parameter
      const nextUrl = searchParams.get('next');
      if (nextUrl) {
        router.push(decodeURIComponent(nextUrl));
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('login_title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('login_subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {redirectMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg text-sm"
                >
                  {redirectMessage}
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('username')}
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12"
                    placeholder={t('username')}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pr-12"
                      placeholder={t('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('login_button')}...
                  </>
                ) : (
                  t('login_button')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {t('forgot_password')}
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                {t('no_account')}{' '}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t('register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
