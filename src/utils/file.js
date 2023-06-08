import fs from "fs";

function checkExtension(fileName, type = "photo") {
    let allowedExtensions = ['.jpg', '.jpeg', '.png'];
    if (type !== "photo") {
        allowedExtensions = ['.mp4'];
    }

    const ext = fileName.split('.').pop().toLowerCase();
    return !!allowedExtensions.includes(`.${ext}`);
}

function checkFileSize(fileSize) {
    const maxFileSize = 2 * 1024 * 1024 // 2mb
    return fileSize <= maxFileSize;
}

function fileNameGenerator(fileName) {
    const ext = fileName.split('.').pop();
    const randomNumber = Math.floor(Math.random() * 100 ** 2);
    return `${randomNumber}-${Date.now()}.${ext}`.trim();
}

export const fileUpload = (file, type = "photo") => {
    try {
        if (!checkExtension(file.name, type)) {
            return {
                status: false,
                message: "You can upload just photos",
            }
        }

        if (!checkFileSize(file.size)) {
            return {
                status: false,
                message: "You can upload max 2MB",
            }
        }

        const uploadPath = 'public/' + fileNameGenerator(file.name);
        file.mv(uploadPath, function (err) {
            if (err) {
                return {
                    status: false,
                    message: "File upload error"
                }
            }
        });

        return {
            status: true,
            filePath: uploadPath
        }
    } catch (e) {
        return {
            status: false,
            message: e.message
        }
    }
}

export const fileDelete = (filePath) => {
    fs.unlink(filePath, e => {
        if (e && e.code === 'ENOENT') {
            return {
                status: false,
                message: "File doesn't exist"
            }
        } else if (e) {
            return {
                status: false,
                message: "File delete error"
            }
        } else {
            return {
                status: true
            }
        }
    })
}
