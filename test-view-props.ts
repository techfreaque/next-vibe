import { ViewProps, View } from 'react-native';
import React from 'react';

// Test 1: Check if ViewProps has className
type TestViewPropsHasClassName = ViewProps extends { className?: string } ? 'YES' : 'NO';
const test1: TestViewPropsHasClassName = 'YES'; // Should work if ViewProps has className

// Test 2: Create a props object with className
const viewProps: ViewProps = {
  className: 'test'
};

// Test 3: Check View component props
type ViewComponentProps = React.ComponentPropsWithoutRef<typeof View>;
const viewComponentProps: ViewComponentProps = {
  className: 'test'
};

export { test1, viewProps, viewComponentProps };
