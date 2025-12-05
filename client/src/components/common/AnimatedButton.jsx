import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Premium animated button with multiple variants and effects
 */
const AnimatedButton = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    glow = false,
    onClick,
    type = 'button',
    ...props
}) => {
    const sizeClasses = {
        sm: 'px-4 py-2.5 text-sm gap-2',
        md: 'px-6 py-3.5 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-2.5',
        xl: 'px-10 py-5 text-xl gap-3',
    };

    const variantStyles = {
        primary: {
            base: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30',
            hover: 'hover:shadow-xl hover:shadow-primary/40',
            glow: 'shadow-glow-primary',
        },
        secondary: {
            base: 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-200',
            hover: 'hover:bg-white/10 hover:border-white/20',
            glow: '',
        },
        ghost: {
            base: 'text-slate-400 hover:text-white',
            hover: 'hover:bg-white/5',
            glow: '',
        },
        outline: {
            base: 'border-2 border-primary text-primary bg-transparent',
            hover: 'hover:bg-primary/10',
            glow: '',
        },
        danger: {
            base: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
            hover: 'hover:shadow-xl hover:shadow-red-500/40',
            glow: '',
        },
        success: {
            base: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
            hover: 'hover:shadow-xl hover:shadow-emerald-500/40',
            glow: '',
        },
        clothes: {
            base: 'bg-gradient-to-r from-clothes to-primary-dark text-white shadow-lg shadow-clothes/30',
            hover: 'hover:shadow-xl hover:shadow-clothes/40',
            glow: 'shadow-clothes/40',
        },
        shoes: {
            base: 'bg-gradient-to-r from-shoes to-orange-600 text-white shadow-lg shadow-shoes/30',
            hover: 'hover:shadow-xl hover:shadow-shoes/40',
            glow: 'shadow-shoes/40',
        },
        bags: {
            base: 'bg-gradient-to-r from-bags to-pink-600 text-white shadow-lg shadow-bags/30',
            hover: 'hover:shadow-xl hover:shadow-bags/40',
            glow: 'shadow-bags/40',
        },
        accessories: {
            base: 'bg-gradient-to-r from-accessories to-teal-600 text-white shadow-lg shadow-accessories/30',
            hover: 'hover:shadow-xl hover:shadow-accessories/40',
            glow: 'shadow-accessories/40',
        },
    };

    const style = variantStyles[variant] || variantStyles.primary;

    return (
        <motion.button
            type={type}
            className={`
        relative inline-flex items-center justify-center font-semibold
        rounded-xl overflow-hidden
        transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${style.base}
        ${style.hover}
        ${glow ? style.glow : ''}
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { y: -2, scale: 1.01 } : {}}
            whileTap={!disabled && !loading ? { y: 0, scale: 0.98 } : {}}
            {...props}
        >
            {/* Shine effect overlay */}
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-inherit">
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                        {children}
                        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                    </>
                )}
            </span>
        </motion.button>
    );
};

/**
 * Icon-only button variant
 */
export const IconButton = ({
    icon: Icon,
    className = '',
    variant = 'ghost',
    size = 'md',
    ...props
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const variantClasses = {
        ghost: 'text-slate-400 hover:text-white hover:bg-white/10',
        glass: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
        primary: 'bg-primary/20 text-primary hover:bg-primary/30',
    };

    return (
        <motion.button
            className={`
        inline-flex items-center justify-center rounded-xl
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <Icon className={iconSizes[size]} />
        </motion.button>
    );
};

export default AnimatedButton;
