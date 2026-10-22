/**
 * globals.d.ts — this is a JSX-first codebase (the client asked for
 * JavaScript, not TypeScript). Only the Vite-required entry is TSX,
 * so we relax module resolution for the JS/JSX modules it imports.
 */
declare module "*.jsx";
declare module "*.js";
declare module "@barba/core";
// Also catch extensionless relative imports of JS files.
declare module "*";
