import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium glass-morphism card component with hover effects and optional glow
 */
const GlassCard = ({
    children,
    className = '',
    hover = true,
    glow = false,
    glowColor = 'primary',
    padding = 'md',
    rounded = 'xl',
    onClick,
    selected = false,
    disabled = false,
    as: Component = 'div',
    ...props
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    };

    const roundedClasses = {
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
        full: 'rounded-full',
    };

    const glowColors = {
        primary: 'shadow-primary/20',
        secondary: 'shadow-secondary/20',
        clothes: 'shadow-clothes/20',
        shoes: 'shadow-shoes/20',
        bags: 'shadow-bags/20',
        accessories: 'shadow-accessories/20',
    };

    const baseClasses = `
    relative overflow-hidden
    bg-white/5 backdrop-blur-xl
    border border-white/10
    transition-all duration-300 ease-out
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${hover && !disabled ? 'hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5' : ''}
    ${glow ? `shadow-lg ${glowColors[glowColor]}` : ''}
    ${selected ? 'border-primary bg-primary/10 shadow-xl shadow-primary/25' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const MotionComponent = motion[Component] || motion.div;

    return (
        <MotionComponent
            className={baseClasses}
            onClick={disabled ? undefined : onClick}
            whileHover={hover && !disabled ? { scale: 1.01 } : {}}
            whileTap={onClick && !disabled ? { scale: 0.99 } : {}}
            {...props}
        >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Glow effect */}
            {glow && (
                <div
                    className={`absolute -inset-px rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 bg-gradient-to-r from-${glowColor} to-${glowColor}-light`}
                />
            )}
        </MotionComponent>
    );
};

/**
 * Glass panel with simpler styling
 */
export const GlassPanel = ({ children, className = '', ...props }) => (
    <div
        className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
        {...props}
    >
        {children}
    </div>
);

/**
 * Glass button variant
 */
export const GlassButton = ({
    children,
    className = '',
    variant = 'default',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    ...props
}) => {
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm gap-1.5',
        md: 'px-5 py-3 text-base gap-2',
        lg: 'px-7 py-4 text-lg gap-2.5',
    };

    const variantClasses = {
        default: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white',
        primary: 'bg-primary/20 border-primary/50 hover:bg-primary/30 text-primary-light',
        success: 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-400',
        danger: 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400',
    };

    return (
        <button
            className={`
        inline-flex items-center justify-center font-medium
        backdrop-blur-md border rounded-xl
        transition-all duration-200
        hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    );
};

export default GlassCard;
