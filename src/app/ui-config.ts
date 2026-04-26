const runtimeEnv =
  (globalThis as typeof globalThis & { __DPO_ENV__?: Record<string, string> }).__DPO_ENV__ || {};

const apiBaseUrl = runtimeEnv['DPO_API_BASE_URL'] || 'http://localhost:3001/api/v1';

export const UI_CONFIG = {
  colors: {
    primaryTeal: '#00A0AF',
    primaryOrange: '#E87722',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    bgPage: '#F0F0F0',
    bgCard: '#FFFFFF',
    bgInput: '#F0F0F0',
    border: '#E0E0E0',
    successGreen: '#00B050',
    warningYellow: '#F5A623',
    dangerRed: '#CC0000',
    selectedBlue: '#0070C0',
    riskHigh: '#CC0000',
    riskMediumHigh: '#FF4444',
    riskOrange: '#FFA500',
    riskYellow: '#FFD700',
    riskBlock: '#D0D0D0',
    rowTint: 'rgba(204,0,0,0.04)',
    tableHeaderBg: '#F5F5F5',
    skeletonBase: '#E0E0E0',
    skeletonHighlight: '#F5F5F5'
  },
  typography: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    sizeXs: '10px',
    sizeSm: '11px',
    sizeBase: '12px',
    sizeMd: '13px',
    sizeLg: '15px',
    sizeXl: '20px',
    size2xl: '28px',
    sizeHeroTitle: '36px',
    weightNormal: 400,
    weightMedium: 500,
    weightBold: 700
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  },
  sizes: {
    logoWidth: '220px',
    logoHeight: '52px',
    controlHeight: '36px',
    avatarSm: '24px',
    avatarMd: '40px',
    avatarLg: '72px',
    avatarXl: '88px',
    skeletonNameWidth: '180px',
    skeletonLineHeight: '14px',
    metaKeyWidth: '110px',
    listMaxHeight: '100%'
  },
  layout: {
    leftWidth: '23%',
    centerWidth: '1fr',
    rightWidth: '23%',
    panelMinHeight: 'calc(100vh - 250px)'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    pill: '20px'
  },
  shadows: {
    card: '0 2px 6px rgba(0,0,0,0.08)'
  },
  api: {
    baseUrl: apiBaseUrl,
    loginUrl: '/login'
  },
  animation: {
    skeletonDuration: '1.5s',
    fadeInDuration: '150ms',
    modalInDuration: '200ms'
  },
  viewport: {
    minWidth: '1280px'
  }
} as const;
