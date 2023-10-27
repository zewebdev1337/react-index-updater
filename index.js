import fs from 'fs';
import path from 'path';

function scanDirectory(directory) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(directory, file.name);

            if (file.isDirectory()) {
                scanDirectory(fullPath);
            } else if (file.isFile() && (file.name.endsWith('.jsx') || file.name.endsWith('.tsx'))) {
                updateIndexFile(fullPath, file.name);
            }
        });
    });
}

function updateIndexFile(filePath, fileName) {
    const directory = path.dirname(filePath);
    const fileExtension = fileName.endsWith('.jsx') ? '.js' : '.ts';
    const indexFilePath = path.join(directory, `index${fileExtension}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        const exportedComponents = data.match(/export const \w+/g);
        if (!exportedComponents) return;

        const componentNames = exportedComponents.map(line => line.split(' ')[2]);

        fs.readFile(indexFilePath, 'utf8', (err, indexData) => {
            let newIndexData = err ? '' : indexData;

            componentNames.forEach(name => {
                const exportLine = `export { ${name} } from './${fileName}';\n`;

                if (!newIndexData.includes(exportLine)) {
                    newIndexData += exportLine;
                }
            });

            fs.writeFile(indexFilePath, newIndexData, 'utf8', err => {
                if (err) {
                    console.error(`Error writing file: ${err}`);
                }
            });
        });
    });
}

scanDirectory('./src');