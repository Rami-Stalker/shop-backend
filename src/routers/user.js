const express = require("express");
const userRouter = express.Router();
const connection = require('../Utils/connection');
const auth = require("../middlewares/auth");
const User = require("../models/user");
const multer = require('multer');
const { parse, join } = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require("path");
const { encodeImageToBlurhash } = require('../helpers/blurHash');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        // Calling the callback passing the random name generated with the original extension name
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }
        const path = `./uploads/${randomName}`;

        const parseFile = parse(file.originalname);
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        cb(null, `${randomName}/${parseFile.name}${parseFile.ext}`);
    },
});

const upload = multer({ storage });

userRouter.post("/up-load-file/upload", upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        const blurHash = await encodeImageToBlurhash(file.path);

        let user = await User.findById("64aedef510994c2f06d3650e");
        user.image = file.filename;
        user.blurHash = blurHash;
        user = await user.save();

        res.status(200).json({
            file: `http://localhost:3000/api/user/up-load-file/${req.file.filename}`,
            blurHash: blurHash,
        });
    } catch (error) {
        res.status(400).json({
            message: "failed",
        });
    }
});

userRouter.get('/up-load-file/:folder/:image', async (req, res) => {
    try {
        const folder = req.params.folder;
        const image = req.params.image;
        const uploadsPath = path.resolve(__dirname, '../uploads');
        console.log(folder);

        const filePath = path.join(uploadsPath, folder, image);

        console.log(filePath);

        if (fs.existsSync(filePath)) {
            const fileExtension = path.extname(filePath);
            let contentType = 'application/octet-stream';
            if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
                contentType = 'image/jpeg';
            } else if (fileExtension === '.png') {
                contentType = 'image/png';
            }

            res.setHeader('Content-Type', contentType);

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ message: "File not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// userRouter.get("/files/:filename", (req, res) => {
//     console.log("file");
//     connectionGfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         console.log("ddddddddd");
//         if (!file || file.length == 0) {
//             res.status(404).json({
//                 error: "404",
//                 message: "The Resource Does Not Exist, Invalid request",
//             });
//         } else {
//             console.log("There is a file");
//             res.set({
//                 "Content-Type": file.contentType,
//             });
//             const readStream = connectionGfs.createReadStream(file.filename);
//             // const readStream = connectionGfs.createReadStream({ filename: file.filename });
//             readStream.pipe(res);
//         }
//     });
// });


// get user info
userRouter.get("/info", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

// Save user token fcm
userRouter.post("/save-user-token-fcm", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user);
        if (user) {
            user.tokenFCM = req.body.tokenFCM;
        }
        user = await user.save();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// update user data
userRouter.post("/modify-user-info", auth, async (req, res) => {
    try {
        const { address, name, phone } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user.name = name;
        user.phone = phone;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});






































// const storage = multer.diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//         const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//         //Calling the callback passing the random name generated with the original extension name
//         if (!fs.existsSync('./uploads')) {
//             fs.mkdirSync('./uploads');
//         }
//         const path = `./uploads/${randomName}`;

//         const parseFile = parse(file.originalname);
//         if (!fs.existsSync(path)) {
//             fs.mkdirSync(path);
//         }
//         cb(null, `${randomName}/${parseFile.name}${parseFile.ext}`);
//     },
// });

// const upload = multer({ storage });

// // Handle POST request with file upload
// userRouter.post('/up-load-file/upload', upload.single('file'), async (req, res) => {
//     const file = req.file;
//     try {
//         const parseFile = parse(file.originalname);
//         console.log(file.filename);
//         console.log(`./uploads/${file.filename}`);
//         // const result = await this._upLoadFileService.createUploadFile(
//         //     parseFile.name,
//         //     file.path,
//         // );

//         const blurHash = encodeImageToBlurhash(file.path);
//         // return new Ok('Upload file Success', {
//         //     image: result.id,
//         //     blurHash: blurHash,
//         // });
//         res.status(200).json({image: `./uploads/${file.filename}`});
//     } catch (e) {
//         res.json({message: e});
//     }
// });

// Handle updating the user's avatar (assuming a route like '/api/user/avatar')
userRouter.patch('/api/user/avatar', async (req, res) => {
    const { avatar, blurHash } = req.body;
    try {
        console.log("avatar");
        const { blurHash, image } = req.body;
        let user = await User.findById(req.user);
        user.blurHash = blurHash;
        console.log(avatar.path);
        user.image = avatar.path;
        user = await user.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// // update user data
// userRouter.post("/avatar", auth, async (req, res) => {
//     try {
//         const { blurHash, image } = req.body;
//         let user = await User.findById(req.user);
//         user.blurHash = blurHash;
//         user.image = image;
//         user = await user.save();
//         res.json(user);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

module.exports = userRouter;