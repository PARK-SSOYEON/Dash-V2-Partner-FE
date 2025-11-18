const getEnv = (key: string, fallback?: string) => {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    if (!value && fallback === undefined) {
        throw new Error(`Missing env: ${key}`);
    }
    return value ?? fallback;
};

export const ENV = {
    APP_API_URL: getEnv("VITE_APP_API_URL"),
};
