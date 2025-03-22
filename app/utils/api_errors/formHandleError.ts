import axios from "axios";
import toast from "react-hot-toast";

export const formHandleError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const { response } = error;
    if (response?.status === 400) {
      const errorMessages = response.data?.message;
      if (Array.isArray(errorMessages)) {
        try {
          errorMessages.forEach((msg) => toast.error(JSON.stringify(msg)));
        } catch (error) {
          console.log(error);
          toast.error("Validation Error.");
        }
      } else {
        toast.error(response.data?.message || "Bad Request.");
      }
    } else {
      toast.error(response?.data?.message || "An unexpected error occurred.");
    }
  } else {
    toast.error("An unexpected error occurred.");
  }
};
