import React, {ComponentProps, forwardRef} from 'react';
import {FieldError} from './Form';

export interface InputProps extends ComponentProps<'input'> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({label, type = 'text', ...props}, ref) {
  return (
    <div>
      <label>{label}</label>
      <input className="input_default" type={type} ref={ref} {...props} />
      <FieldError name={props.name} />
    </div>
  );
});

export default Input;
