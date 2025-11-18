export function isValidOtp(v: string): boolean {
    return /^\d{6}$/.test(v);
}
