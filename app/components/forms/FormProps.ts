export interface FormProps<T> {
  id?: string;
  initialData?: Partial<T>;
  onSuccess?: () => void;
  onClose?: () => void;
}
