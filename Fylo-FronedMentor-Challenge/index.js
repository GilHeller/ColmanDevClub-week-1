window.onload = () => {
    const MAX_SIZE = 1000;
    const MB = 1024 * 1024;
    
    const setCookie = (cookieName, cookieValue) => {
        const expires = new Date();
        if (!getAllCookies()?.[cookieName]) {    
            expires.setTime(expires.getTime() + 24*60*60*1000); 
            const cookieContent = `${cookieName}=${cookieValue};expires=${expires.toUTCString()};path=/`;      
            document.cookie = cookieContent;
        }
    }

    const getAllCookies = () => {
        const cookiesSeperated = document?.cookie?.split(";");
        const cookiesObject = {};
        cookiesSeperated?.map(cookie => {
            const cookieSeperated = cookie?.split("=");
            cookiesObject[cookieSeperated[0]] = Number(cookieSeperated[1]) || 0;
        });
        return cookiesObject;
    }

    const saveFiles = (files) => {
        files.map(file => {
            const cookieName = `${file.name}_size`;
            setCookie(cookieName, file?.size);
        })
    }

    const totalSizeOfFilesInBytes = () => {
        const fileObject = getAllCookies();
        if (Object.keys(fileObject).length){
            const totalSize = Object.values(fileObject).reduce((s1, s2) => s1 + s2)
            return(totalSize)
        }
        return 0;
    }

    const updateProgress = () => {
        const storageProgress = document.getElementById("storage-progress");
        const usageInfo = document.getElementById("usage-info");
        const baloonInfo = document.getElementById("baloon-info");
        const totalSizeMB = parseInt(totalSizeOfFilesInBytes() / MB * MAX_SIZE);
        if (storageProgress.value !== totalSizeMB){
            storageProgress.value = totalSizeMB;
            usageInfo.textContent = `${totalSizeMB} MB`;
            baloonInfo.textContent = `${MAX_SIZE - totalSizeMB}`
        }
        
    }

    const handleFileUplaod = (e) => {
        const filesList = e.target.files;
        const files = filesList? Object.values(filesList): [];
        const suffixRegex = /.+.(png|jpg|jpeg|gif)$/;
        const invalidFileIndex = files.findIndex((f) => !suffixRegex.test(f?.name));
        if (invalidFileIndex !== -1){
            alert(`File format isn’t supported: ${files[invalidFileIndex].name}`);
            return;
        }
        saveFiles(files);
        updateProgress();
    }
    updateProgress();
    document.getElementById("upload-input").addEventListener("change", handleFileUplaod);
}