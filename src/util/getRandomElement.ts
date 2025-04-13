export default function getRandomElement(s: readonly string[]): string {
    return s[Math.floor(Math.random() * s.length)];
}