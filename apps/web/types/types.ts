interface ValidateFormProp {
  email: string;
  password: string;
  setErrors: ({}) => void;
}

interface LoaderProp {
  color: string;
  strokeWidth: string;
  size: string;
}

export type { ValidateFormProp, LoaderProp };
