'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Maximize2,
  X,
} from 'lucide-react';
import { ShopTheme } from '@/lib/types';

interface LivePreviewPaneProps {
  theme: ShopTheme;
  isVisible: boolean;
  onToggle: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceDimensions = {
  desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', height: '100%', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', height: '100%', label: 'Mobile', icon: Smartphone },
};

const paneVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const fullscreenVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

export default function LivePreviewPane({
  theme,
  isVisible,
  onToggle,
}: LivePreviewPaneProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const PreviewContent = () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        key={device}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto"
        style={{
          width: deviceDimensions[device].width,
          maxWidth: '100%',
          height: deviceDimensions[device].height,
          maxHeight: '100%',
        }}
      >
        {/* Mock storefront preview */}
        <div className="w-full h-full overflow-y-auto">
          {/* Header */}
          <div
            className="border-b"
            style={{
              backgroundColor: theme.primaryColor || '#4F46E5',
              color: '#ffffff',
              padding: device === 'mobile' ? '12px 16px' : '16px 24px',
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="font-bold"
                style={{
                  fontSize: device === 'mobile' ? '18px' : '24px',
                  fontFamily: theme.font === 'inter' ? 'Inter, sans-serif' : theme.font === 'playfair' ? 'Playfair Display, serif' : theme.font === 'poppins' ? 'Poppins, sans-serif' : 'Roboto, sans-serif',
                }}
              >
                {theme.name || 'My Store'}
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-white/20 rounded"></div>
                <div className="w-6 h-6 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div
            className="relative"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor || '#4F46E5'}, ${theme.secondaryColor || '#EC4899'})`,
              padding: device === 'mobile' ? '32px 16px' : '48px 24px',
            }}
          >
            <div className="relative z-10 text-white text-center max-w-2xl mx-auto">
              <h1
                className="font-bold mb-2"
                style={{
                  fontSize: device === 'mobile' ? '24px' : '36px',
                  fontFamily: theme.font === 'inter' ? 'Inter, sans-serif' : theme.font === 'playfair' ? 'Playfair Display, serif' : theme.font === 'poppins' ? 'Poppins, sans-serif' : 'Roboto, sans-serif',
                }}
              >
                Welcome to Our Store
              </h1>
              <p
                className="opacity-90"
                style={{
                  fontSize: device === 'mobile' ? '14px' : '16px',
                }}
              >
                Discover our amazing collection of products
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <button
                  className="px-4 py-2 bg-white rounded font-medium"
                  style={{
                    color: theme.primaryColor || '#4F46E5',
                    fontSize: device === 'mobile' ? '14px' : '16px',
                  }}
                >
                  Shop Now
                </button>
                <button
                  className="px-4 py-2 bg-white/20 text-white rounded font-medium"
                  style={{
                    fontSize: device === 'mobile' ? '14px' : '16px',
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            style={{
              padding: device === 'mobile' ? '24px 16px' : '48px 24px',
            }}
          >
            <h2
              className="font-bold mb-4"
              style={{
                fontSize: device === 'mobile' ? '20px' : '28px',
                fontFamily: theme.font === 'inter' ? 'Inter, sans-serif' : theme.font === 'playfair' ? 'Playfair Display, serif' : theme.font === 'poppins' ? 'Poppins, sans-serif' : 'Roboto, sans-serif',
              }}
            >
              Featured Products
            </h2>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns:
                  device === 'mobile'
                    ? '1fr'
                    : device === 'tablet'
                    ? 'repeat(2, 1fr)'
                    : 'repeat(3, 1fr)',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    borderRadius: theme.cardStyle === 'elevated' ? '12px' : theme.cardStyle === 'bordered' ? '8px' : '8px',
                    borderWidth: theme.cardStyle === 'bordered' ? '2px' : '1px',
                    borderColor: theme.cardStyle === 'bordered' ? '#000' : '#e5e7eb',
                  }}
                >
                  <div
                    className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
                    }}
                  ></div>
                  <div className="p-3">
                    <h3
                      className="font-semibold mb-1"
                      style={{
                        fontSize: device === 'mobile' ? '14px' : '16px',
                      }}
                    >
                      Product {i}
                    </h3>
                    <p
                      className="text-gray-600 text-sm mb-2"
                      style={{
                        fontSize: device === 'mobile' ? '12px' : '14px',
                      }}
                    >
                      Beautiful product description
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold"
                        style={{
                          color: theme.primaryColor || '#4F46E5',
                          fontSize: device === 'mobile' ? '16px' : '18px',
                        }}
                      >
                        ${(i * 10).toFixed(2)}
                      </span>
                      <button
                        className="px-3 py-1 rounded text-white font-medium text-sm"
                        style={{
                          backgroundColor: theme.primaryColor || '#4F46E5',
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="bg-gray-900 text-white text-center"
            style={{
              padding: device === 'mobile' ? '24px 16px' : '32px 24px',
            }}
          >
            <p
              className="opacity-70"
              style={{
                fontSize: device === 'mobile' ? '12px' : '14px',
              }}
            >
              © 2024 {theme.name || 'My Store'}. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Toggle button when pane is hidden */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onToggle}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-l-xl shadow-lg hover:bg-indigo-700 transition-colors"
          type="button"
        >
          <Eye className="w-5 h-5" />
          <span className="font-medium">Show Preview</span>
        </motion.button>
      )}

      {/* Split-screen preview pane */}
      <AnimatePresence>
        {isVisible && !isFullscreen && (
          <motion.div
            variants={paneVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 w-1/2 bg-white shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <div className="flex items-center gap-2">
                {/* Device toggles */}
                {Object.entries(deviceDimensions).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDevice(key as DeviceType)}
                    className={`
                      p-2 rounded-lg transition-all
                      ${
                        device === key
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }
                    `}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={onToggle}
                  className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Hide Preview"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-hidden">
              <PreviewContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            variants={fullscreenVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Full Preview
                </h3>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <div className="flex items-center gap-2">
                {/* Device toggles */}
                {Object.entries(deviceDimensions).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDevice(key as DeviceType)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-sm
                      ${
                        device === key
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}

                {/* Close fullscreen */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  <X className="w-4 h-4" />
                  Exit Fullscreen
                </button>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-hidden">
              <PreviewContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
