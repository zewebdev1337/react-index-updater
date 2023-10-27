# React Index Updater

This npm package is a utility script for React projects that automatically updates `index.js` or `index.ts` files in each subdirectory of the `./src` directory. It scans through the `./src` directory recursively and for each subdirectory, it checks for React component files (`.jsx` or `.tsx`).

For each component file, it reads the file content to find exported components. It then updates the corresponding `index.js` or `index.ts` file in the same directory to include an export statement for each component.

If the `index.js` or `index.ts` file does not exist, it creates one. This allows for easier importing of components from a directory, enabling syntax like `import { Component1, Component2 } from './directory'` instead of having to write an import statement for each component.

### How to use:

Install globally ``npm install @zewebdev/react-index-updater --global``

Run from the root of your react project: ``react-index-updater``

Please note that this script assumes that components are exported in the format ``export const ComponentName = ...``, if a different format is used, (i.e ``export default ComponentName``) the script would need to be adjusted accordingly. Also, the script does not handle the removal of non-existent components from the index file. This would require a more complex parsing of the JavaScript/TypeScript files.
