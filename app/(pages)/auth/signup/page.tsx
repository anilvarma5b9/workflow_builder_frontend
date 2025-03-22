'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { SignupDTO, SignupSchema, signup } from '@/api/services/user_auth_service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AuthUtil from '@/app/utils/auth/AuthUtil'

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupDTO>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupDTO) => {
    try {
      const response = await signup(data);
      if (response.status) {
        toast.success(response.message || 'Signup successful');

        // ✅ Save Auth Details
        AuthUtil.saveToken(response?.data?.access_token || '');
        AuthUtil.saveUserId("" + response?.data?.user.user_id || '');
        AuthUtil.saveUserName(response?.data?.user?.name || '');
        AuthUtil.saveUserEmail(response?.data?.user?.email || '');

        router.push('/workflow/list');
      } else {
        toast.error(response.message || 'Signup failed');
      }
    } catch (error: unknown) {
      toast.error(error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
              className="w-full p-2 border rounded text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="w-full p-2 border rounded text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full p-2 border rounded text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
