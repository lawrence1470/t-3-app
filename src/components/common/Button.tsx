import React, {ComponentProps, FC} from 'react';
import cx from 'classnames';

type Colors = 'Error' | 'Primary';

export interface ButtonProps extends ComponentProps<'button'> {
  children: string;
  color?: Colors;
}

const Button: FC<ButtonProps> = ({children, color = 'Primary', ...props}) => {
  return (
    <div>
      <button
        {...props}
        className={cx(
          'inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out',
          {
            'bg-blue-600 focus:bg-blue-700': color === 'Primary',
            'bg-red-600 focus:bg-red-700': color === 'Error',
          }
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
