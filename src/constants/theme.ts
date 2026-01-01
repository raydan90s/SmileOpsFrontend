export const Colors = {
  primary: '#2e2f93',
  primaryLight: '#4142ba',
  primaryDark: '#13144b',
  
  secondary: '#7778d6',
  secondaryLight: '#9595e0',
  secondaryDark: '#4142ba',
  
  accent: '#b4b5e9',
  accentLight: '#d8d8f3',
  accentDark: '#7778d6',
  
  background: '#f0f0fa',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0a1626',
  
  surface: '#FFFFFF',
  surfaceLight: '#f0f0fa',
  surfaceDark: '#13144b',
  
  text: '#13144b',           
  textLight: '#d8d8f3',      
  textDark: '#0a1626',       
  textInverse: '#FFFFFF',
  
  border: '#d8d8f3',
  borderLight: '#f0f0fa',
  borderDark: '#9595e0',
  
  success: '#34C759',
  warning: '#FF9500',
  error: '#EF4444',
  info: '#5AC8FA',
  
  placeholder: '#9595e0',
  
  shadow: '#000000',
  
  scrollbarTrack: '#2e2f93',
  scrollbarThumb: '#0a1626',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,      
  sm: 14,
  md: 16,      
  lg: 18,
  xl: 24,      
  xxl: 28,
  xxxl: 32,
  huge: 40,   
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
};

export const Layout = {
  window: {
    width: '100%',
    height: '100%',
  },
  scrollbarWidth: 7,
};

export const Opacity = {
  disabled: 0.5,
  hover: 0.8,
  pressed: 0.6,
};

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  shadows: Shadows,
  layout: Layout,
  opacity: Opacity,
};

export default Theme;