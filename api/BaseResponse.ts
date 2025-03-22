export interface BR<T> {
  status: boolean;
  message: string;
  error?: string;
  data?: T;
}