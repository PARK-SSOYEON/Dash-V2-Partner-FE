export function isValidBirthDate(input: string): boolean {
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(input)) return false;
    const [yyyy, mm, dd] = input.split(".").map((v) => Number(v));
    if (yyyy < 1900 || yyyy > 2025) return false;
    if (mm < 1 || mm > 12) return false;

    const monthDays: Record<number, number> = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    const maxDay = monthDays[mm];
    if (dd < 1 || dd > maxDay) return false;

    return true;
}

export function formatBirthInput(input: string): string {
    let v = input.replace(/[^0-9]/g, "").slice(0, 8);
    if (v.length >= 5) v = v.slice(0, 4) + "." + v.slice(4);
    if (v.length >= 8) v = v.slice(0, 7) + "." + v.slice(7);
    return v;
}
