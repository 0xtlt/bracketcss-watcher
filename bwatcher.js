#!/usr/bin/env node

const fs = require('fs');
const hound = require('hound');
const bracketcss = require("bracketcss");

function transpile_file(file, dist) {
    fs.readFile(file, function(err, buf) {
        let css = bracketcss(buf.toString());

        fs.writeFile(dist, css, (err) => {
            if (err) console.log(err);
        });
    });
}

function watchFolder(folder, extb = ".bcss", distFolder) {
    const watcher = hound.watch(folder)

    watcher.on('change', function(file, stats) {
        let fileParts = file.split(".");
        let ext = fileParts[fileParts.length-1];
        
        if("."+ext === extb) {
            let newFile = fileParts.map((value, index) => index === (fileParts.length-1) ? "css" : value).join(".");

            if(distFolder) {
                let dirParts = newFile.split("/");
                newFile = distFolder + (distFolder[distFolder.length - 1] === "/" ? "" : "/") + dirParts[dirParts.length - 1];
            }

            console.log(newFile)

            transpile_file(file, newFile)
            console.log(file + ' updated')
        }
    })
}

let extension = ".bcss";
let folder = null;
let dist = null;

process.argv.forEach(arg => {
    if(arg.substr(0, 7) === "folder=") {
        folder = arg.substr(7)
    }

    if(arg.substr(0, 5) === "dist=") {
        dist = arg.substr(5)
    }

    if(arg.substr(0 ,10) === "extension=") {
        let extension = arg.substr(10);
    }
});

if(folder) {
    watchFolder(folder, extension, dist);
}