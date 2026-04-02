import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#0f766e',
            light: '#115e59',
            dark: '#0d655d',
        },
        background: {
            default: mode === 'light' ? '#f5f7fb' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
            secondary: mode === 'light' ? '#64748b' : '#cbd5e1',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        fontSize: 13, // Reduced base size
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: '12px', // Softer corners for menus
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0px 4px 20px rgba(0, 0, 0, 0.08)'
                        : '0px 4px 20px rgba(0, 0, 0, 0.4)',
                }
            }
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    marginTop: '8px',
                    minWidth: '180px',
                },
                list: {
                    padding: '4px', // Compact padding
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '0.8125rem', // Smaller text ~13px
                    borderRadius: '6px', // Rounded items
                    margin: '2px 4px', // Float items slightly
                    padding: '6px 12px',
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: mode === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.16)',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: mode === 'light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.12)',
                        }
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                },
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    width: '100%',
                }
            }
        }
    },
});
