const multer = require("multer");
const path = require("path");

const img_Uploading = () => {
    var imgStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "Uploads_image");
        },
        filename: function (req, file, cb) {
            const extantion = path.extname(file.originalname);
            const uniqueString =
                file.fieldname + "_" + Date.now() + extantion;
            cb(null, uniqueString);
        },
    });
    const multerFilter = function (req, file, cb) {
        if (file.mimetype === "application/pdf" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            // cb(null, false);
            return cb('Invalid file type. Only images (JPEG, PNG) and PDFs are allowed.');
        }
    };

    const uploading = multer({
        storage: imgStorage,
        fileFilter: multerFilter,
    });
    return uploading;
};

const Qualification_certificate_Uploading = () => {
    try {

        const projectStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "Uploads_Qualification_certificate");
            },
            filename: function (req, file, cb) {
                const extantion = path.extname(file.originalname);
                const uniqueString =
                    file.fieldname + "-" + Date.now() + extantion;
                cb(null, uniqueString);
            },
        });
        const multerFilter = function (req, file, cb) {
            if (file.mimetype === "application/pdf" ||
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        };
        const uploading = multer({
            storage: projectStorage,
            fileFilter: multerFilter,
        });
        return uploading;
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};
const personal_ID_card_Uploading = () => {
    try {

        const projectStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "Uploads_Personal_ID_card");
            },
            filename: function (req, file, cb) {
                const extantion = path.extname(file.originalname);
                const uniqueString =
                    file.fieldname + "-" + Date.now() + extantion;
                cb(null, uniqueString);
            },
        });
        const multerFilter = function (req, file, cb) {
            if (file.mimetype === "application/pdf" ||
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        };
        const uploading = multer({
            storage: projectStorage,
            fileFilter: multerFilter,
        });
        return uploading;
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

module.exports = { img_Uploading, Qualification_certificate_Uploading ,personal_ID_card_Uploading};



