/**
 * Module mocks for Next.js-specific imports
 * These prevent crashes and log warnings instead
 */

import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Mock for next/link
export const nextLinkMock = {
  __esModule: true,
  default: function Link({ href, children, className, ...props }: LinkProps) {
    console.warn('🔶 Using mock Next.js Link - href:', href);
    const { TouchableOpacity, Text, View } = require('react-native');
    const { router } = require('expo-router');

    const handlePress = () => {
      try {
        console.log('📱 Navigating to:', href);
        if (typeof href === 'string') {
          router.push(href);
        }
      } catch (e) {
        console.error('Navigation error:', e);
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} {...props}>
        {typeof children === 'string' ? (
          <Text style={{ color: '#3B82F6', textDecorationLine: 'underline' }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  },
};

interface ImageProps {
  src: string | { uri: string };
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  [key: string]: unknown;
}

// Mock for next/image
export const nextImageMock = {
  __esModule: true,
  default: function Image({ src, alt, width, height, fill, className, ...props }: ImageProps) {
    console.warn('🔶 Using mock Next.js Image - src:', src);
    const { Image: RNImage, View } = require('react-native');

    const imageSource = typeof src === 'string' ? { uri: src } : src;
    const imageStyle = fill
      ? { width: '100%', height: '100%' }
      : { width: width || 100, height: height || 100 };

    return (
      <View style={imageStyle}>
        <RNImage
          source={imageSource}
          style={imageStyle}
          accessibilityLabel={alt}
          resizeMode="cover"
          {...props}
        />
      </View>
    );
  },
};

// Mock for next/navigation
export const nextNavigationMock = {
  __esModule: true,
  useRouter: () => {
    console.warn('🔶 Using mock useRouter from next/navigation');
    const { router } = require('expo-router');
    return {
      push: (path: string) => router.push(path),
      replace: (path: string) => router.replace(path),
      back: () => router.back(),
      forward: () => console.warn('forward() not supported in React Native'),
      refresh: () => console.warn('refresh() not supported in React Native'),
      prefetch: () => console.warn('prefetch() not supported in React Native'),
    };
  },
  usePathname: () => {
    console.warn('🔶 Using mock usePathname');
    const { usePathname } = require('expo-router');
    return usePathname();
  },
  useSearchParams: () => {
    console.warn('🔶 Using mock useSearchParams');
    const { useLocalSearchParams } = require('expo-router');
    const params = useLocalSearchParams();
    return new URLSearchParams(params as Record<string, string>);
  },
  useParams: () => {
    console.warn('🔶 Using mock useParams');
    const { useLocalSearchParams } = require('expo-router');
    return useLocalSearchParams();
  },
  redirect: (path: string) => {
    console.warn('🔶 Using mock redirect');
    const { router } = require('expo-router');
    router.replace(path);
  },
  permanentRedirect: (path: string) => {
    console.warn('🔶 Using mock permanentRedirect');
    const { router } = require('expo-router');
    router.replace(path);
  },
  notFound: () => {
    console.warn('🔶 notFound() called - not supported in React Native');
  },
};

// Mock for server-only
export const serverOnlyMock = {
  __esModule: true,
  // Empty module that does nothing - prevents import errors
};

// Mock for next/headers
export const nextHeadersMock = {
  __esModule: true,
  cookies: () => {
    console.warn('🔶 cookies() called in React Native - returning empty');
    return {
      get: () => null,
      getAll: () => [],
      has: () => false,
      set: () => {},
      delete: () => {},
    };
  },
  headers: () => {
    console.warn('🔶 headers() called in React Native - returning empty');
    return new Map();
  },
  draftMode: () => {
    console.warn('🔶 draftMode() called in React Native - returning mock');
    return { isEnabled: false };
  },
};

// Mock for next/server
export const nextServerMock = {
  __esModule: true,
  NextRequest: class MockNextRequest {},
  NextResponse: class MockNextResponse {
    static json(data: unknown) {
      console.warn('🔶 NextResponse.json called in React Native');
      return { data };
    }
    static redirect(url: string) {
      console.warn('🔶 NextResponse.redirect called in React Native');
      return { redirect: url };
    }
  },
};

// Export all mocks
export default {
  'next/link': nextLinkMock,
  'next/image': nextImageMock,
  'next/navigation': nextNavigationMock,
  'server-only': serverOnlyMock,
  'next/headers': nextHeadersMock,
  'next/server': nextServerMock,
};
