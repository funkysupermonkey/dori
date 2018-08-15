import fs from 'fs'
import thumb from 'node-thumbnail';

const fileNameRegex = /^(.*\/)?(?:$|(.+?)(?:(\.[^.]*$)|$))/;

function getImageFilename(sourceFile) {
    let match = fileNameRegex.exec(sourceFile);
    return match[2] + match[3];
}

function getDestinationFile(sourceFile, destinationPath) {
    return (destinationPath + getImageFilename(sourceFile));
}

function createThumbnail(sourceFile, destinationPath) {
    let destinationFile = getDestinationFile(sourceFile, destinationPath);
        return thumb.thumb({
            source: sourceFile,
            destination: destinationPath,
            width: 400,
            suffix: ''
        }).then(res => res[0].dstPath);
}

function moveImage(sourceFile, destinationPath) {
    return new Promise((resolve, reject) => {
        let destinationFile = getDestinationFile(sourceFile, destinationPath);
        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) {
                reject(err);
            }
            fs.unlink(sourceFile, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(destinationFile);
            });
        });
    });
}

export {createThumbnail, moveImage, getImageFilename};