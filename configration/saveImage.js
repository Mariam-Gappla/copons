const path = require("path");
const fs = require("fs");

const saveImage = (file, folder = 'images') => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const saveDir = path.join(__dirname, '..', folder);
    const filePath = path.join(saveDir, fileName);

    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return `/${folder}/${fileName}`;
};

module.exports = saveImage;
