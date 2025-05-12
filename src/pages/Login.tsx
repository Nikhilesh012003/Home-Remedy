
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Users, User, Lock, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    setError(null);
    const success = login(data.username, data.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError("Invalid username or password");
    }
  };

  const handleRoleSelect = (role: 'Admin' | 'User') => {
    form.setValue('username', role);
    form.clearErrors('username');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-200 to-indigo-300">
      <div className="w-full max-w-md p-4 space-y-8">
        <Card className="backdrop-blur-md bg-white/80 shadow-2xl border-0 rounded-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Sign in to access your medical remedies
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleRoleSelect('Admin')}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-3 ${
                  form.watch('username') === 'Admin'
                    ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 shadow-lg'
                    : 'hover:bg-purple-50 border-2 border-transparent'
                }`}
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <span className="font-semibold text-gray-700">Admin</span>
              </button>
              
              <button
                onClick={() => handleRoleSelect('User')}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-3 ${
                  form.watch('username') === 'User'
                    ? 'bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 shadow-lg'
                    : 'hover:bg-pink-50 border-2 border-transparent'
                }`}
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <span className="font-semibold text-gray-700">User</span>
              </button>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                          <Input 
                            placeholder="Enter your username" 
                            className="pl-11 h-12 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="pl-11 h-12 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center text-gray-600">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="text-purple-600 hover:text-purple-700 font-medium p-0"
                onClick={() => navigate('/register')}
              >
                Create one here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

