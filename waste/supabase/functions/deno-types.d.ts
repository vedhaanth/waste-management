
// Minimal Deno type definitions to satisfy the compiler
declare global {
    namespace Deno {
        export interface Env {
            get(key: string): string | undefined;
            set(key: string, value: string): void;
            delete(key: string): void;
            toObject(): { [key: string]: string };
        }
        export const env: Env;

        // Add other properties as needed
        export const version: {
            deno: string;
            v8: string;
            typescript: string;
        };

        export function readTextFile(path: string | URL): Promise<string>;
        export function writeTextFile(path: string | URL, data: string, options?: any): Promise<void>;
        export function serve(handler: (request: Request) => Response | Promise<Response>): void;
        export function serve(options: any, handler: (request: Request) => Response | Promise<Response>): void;
    }
}
export { };
