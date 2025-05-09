export class MiniMustacheService {
    parse(template: string, data: Record<string, string>): string {
        return template.replace(/{{\s*([^}\s]+)\s*}}/g, (_match, key) => {
            return data[key] || '';
        });
    }
}
