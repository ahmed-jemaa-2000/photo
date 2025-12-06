export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFKD') // Separate accent marks
        .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}
