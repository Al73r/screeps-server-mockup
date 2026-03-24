const stdout = process.stdout.write;
const stderr = process.stderr.write;

/*
    Monkey-patch stdout/stderr.write() to remove driver notifications.
*/
export function hookWrite(): void {
    process.stdout.write = function (this: NodeJS.WriteStream, ...args: Parameters<typeof stdout>): boolean {
        if (typeof args[0] === 'string' && args[0].match(/connecting to storage/i)) {
            return true;
        }
        return stdout.apply(this, args);
    } as typeof stdout;
    process.stderr.write = function (this: NodeJS.WriteStream, ...args: Parameters<typeof stderr>): boolean {
        if (typeof args[0] === 'string' && args[0].match(/storage connection lost/i)) {
            return true;
        }
        return stderr.apply(this, args);
    } as typeof stderr;
}

/*
    Reset stdout/stderr.write() to default behavior.
*/
export function resetWrite(): void {
    process.stdout.write = stdout;
    process.stderr.write = stderr;
}
