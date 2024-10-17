const fs = require("fs");


const remove_file_when_update = {

    remove_previous_img : (purposed_user) => {
    try {
        const pathArray = purposed_user.image.split("/")
        const lastIndex = pathArray.length - 1;
        const oldImageFileName = pathArray[lastIndex]
        const oldImagePath = `Uploads_image\\${oldImageFileName}`
        if (!fs.existsSync(oldImagePath)) {
            // throw new Error('File not found')
            console.log("File not found");
            return 
        }
        fs.unlinkSync(oldImagePath)

    } catch (error) {
        throw error 
    }
    },
    remove_previous_qualification_certificate : (purposed_user) => {
        try {
            const pathArray = purposed_user.qualification_certificate.split("/")
            const lastIndex = pathArray.length - 1;
            const oldImageFileName = pathArray[lastIndex]
            const oldImagePath = `Uploads_Qualification_certificate\\${oldImageFileName}`
            if (!fs.existsSync(oldImagePath)) {
                // throw new Error('File not found')
                console.log("File not found");
                return 
            }
            fs.unlinkSync(oldImagePath)

        } catch (error) {
            throw error 
        }
    },
    remove_previous_personal_ID_card : (purposed_user) => {
        try {
            const pathArray = purposed_user.personal_ID_card.split("/")
            const lastIndex = pathArray.length - 1;
            const oldImageFileName = pathArray[lastIndex]
            const oldImagePath = `Uploads_Personal_ID_card\\${oldImageFileName}`
            if (!fs.existsSync(oldImagePath)) {
                // throw new Error('File not found')
                console.log("File not found");
                return 
            }
            fs.unlinkSync(oldImagePath)
    
        } catch (error) {
            throw error 
        }
    },
        

}

module.exports = remove_file_when_update
