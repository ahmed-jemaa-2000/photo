import { HTMLAttributes, ReactNode } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

export default function Section({
  background = 'transparent',
  spacing = 'lg',
  className = '',
  children,
  ...props
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-gray-50 to-white',
    transparent: '',
  };

  const spacingStyles = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-24 lg:py-32',
  };

  const combinedClassName = `${backgroundStyles[background]} ${spacingStyles[spacing]} ${className}`.trim();

  return (
    <section className={combinedClassName} {...props}>
      {children}
    </section>
  );
}
