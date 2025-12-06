import { HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Container({ className = '', children, ...props }: ContainerProps) {
  const baseStyles = 'container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl';

  return (
    <div className={`${baseStyles} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
