#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function scanDirectory(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(directory, file.name);

        if (file.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.isFile() && (file.name.endsWith('.jsx') || file.name.endsWith('.tsx'))) {
            updateIndexFile(fullPath, file.name);
        }
    });
}

function updateIndexFile(filePath, fileName) {
    const directory = path.dirname(filePath);
    const fileExtension = fileName.endsWith('.jsx') ? '.js' : '.ts';
    const indexFilePath = path.join(directory, `index${fileExtension}`);

    const data = fs.readFileSync(filePath, 'utf8');

    const exportedComponents = data.match(/export const \w+/g);
    if (!exportedComponents) return;

    const componentNames = exportedComponents.map(line => line.split(' ')[2]);

    let indexData;
    try {
        indexData = fs.readFileSync(indexFilePath, 'utf8');
    } catch (err) {
        indexData = '';
    }

    componentNames.forEach(name => {
        const exportLine = `export { ${name} } from './${fileName}';\n`;

        if (!indexData.includes(exportLine)) {
            indexData += exportLine;
        }
    });

    fs.writeFileSync(indexFilePath, indexData, 'utf8');
}

scanDirectory('./src');