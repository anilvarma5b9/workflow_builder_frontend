import axios from 'axios';
import toast from 'react-hot-toast';

export const deleteHandleError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const { response } = error;
    if (response?.status === 400) {
      const errorMessages = response.data?.message;
      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(response.data?.message || 'Bad Request.');
      }
    } else {
      toast.error(response?.data?.message || 'An unexpected error occurred.');
    }
  } else {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred.');
  }
};
