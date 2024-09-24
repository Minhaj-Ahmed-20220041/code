require('dotenv').config();

const fs = require("fs");
const path = require('path');

//delete temp images
exports.deleteTempFiles = async () => {
    const directory = process.env.IMAGE_TEMP_DIR;
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
        }
    }
    console.log("Temp files cleaned up.")
}

//create filename
exports.createFileName = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(4, '0');

    const timestampString = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    return timestampString;
}