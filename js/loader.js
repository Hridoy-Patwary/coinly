let fileHandles = new Map();
let currentDirectoryHandle = null;
let trashDirectoryHandle = null;
let previewContainer = document.querySelector(".video-container");

const videoContainer = document.querySelector('.video-container');
const importFile = document.querySelector('.importFile');
const importFolder = document.querySelector('.importFolder');


async function chooseAFile() {
    if (!window.showOpenFilePicker) {
        alert("Your current device does not support the File System API. Try again on desktop Chrome!");
    } else {
        //here you specify the type of files you want to allow
        let options = {
            types: [{
                description: "Images",
                accept: {
                    "image/*": [".png", ".gif", ".jpeg", ".jpg", ".svg", ".mp4"],
                    "text/*": [".txt", ".json"],
                    "application/*": [".json"],
                },
            }],
            excludeAcceptAllOption: true,
            multiple: true,
        };

        // Open file picker and choose a file
        let fileHandle = await window.showOpenFilePicker(options);
        if (!fileHandle[0]) {
            return;
        }

        // get the content of the file
        await fileHandle.forEach(async file => {
            const mainFile = await file.getFile();
            previewFile(mainFile, previewContainer);
        });
    }
}

async function chooseAFolder() {
    try {
        currentDirectoryHandle = await window.showDirectoryPicker();
        localStorage.setItem('folderName', currentDirectoryHandle.name); // Save folder metadata

        fileHandles.clear();
        trashDirectoryHandle = await getOrCreateTrashDirectory(currentDirectoryHandle);

        await processDirectory(currentDirectoryHandle, previewContainer);
    } catch (err) {
        console.error("Error selecting folder:", err);
    }
}
async function getOrCreateTrashDirectory(directoryHandle) {
    try {
        let trashHandle;
        try {
            trashHandle = await directoryHandle.getDirectoryHandle('trash');
        } catch (e) {
            trashHandle = await directoryHandle.getDirectoryHandle('trash', {
                create: true
            });
        }
        return trashHandle;
    } catch (err) {
        console.error("Error creating trash directory:", err);
    }
}
async function processDirectory(directoryHandle, container) {
    for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
            const file = await entry.getFile();
            previewFile(file, previewContainer);
        } else if (entry.kind === 'directory') {
            // Handle subdirectories recursively
            await processDirectory(entry, container);
        }
    }
}

function previewFile(file, container) {
    const fileDiv = document.createElement('div');
    const p = document.createElement('p');
    let appendNewElm = true;
    let maxLength = 40;

    p.className = 'file-name'
    fileDiv.className = 'file-preview';

    if (file.name.length > maxLength) {
        p.textContent = file.name.substring(0, maxLength) + '...';
    }

    if (file.type.startsWith("image/")) {
        let imgPreview = document.createElement("img");
        imgPreview.src = URL.createObjectURL(file);
        fileDiv.appendChild(imgPreview);
    } else if (file.type.startsWith("text/") || file.type.startsWith("application/")) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let textPreview = document.createElement("div");
            textPreview.textContent = event.target.result;
            fileDiv.appendChild(textPreview);
        };
        reader.readAsText(file);
    } else if (file.type.startsWith("video/")) {
        console.log(file)
        let videoPreview = document.createElement('video');
        videoPreview.controls = true;
        videoPreview.autoplay = false;
        videoPreview.muted = true;
        videoPreview.src = URL.createObjectURL(file);
        fileDiv.appendChild(videoPreview);
    } else {
        appendNewElm = false;
        fileDiv.textContent = `Unsupported file type: ${file.type}`;
    }

    if (appendNewElm) {
        const actions = document.createElement('div');
        actions.className = 'file-actions';
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => openEditor(file);
        actions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => moveToTrash(file.name);
        actions.appendChild(deleteButton);

        fileDiv.appendChild(p);
        fileDiv.appendChild(actions);
        container.appendChild(fileDiv);
    }
}

function openEditor(file) {
    const editorContainer = document.getElementById('editor-container');
    const fileEditor = document.getElementById('file-editor');
    const saveButton = document.getElementById('save-file');
    const cancelButton = document.getElementById('cancel-edit');

    fileEditor.value = '';
    fileEditor.disabled = true;
    editorContainer.style.display = 'block';

    const fileHandle = fileHandles.get(file.name);

    fileHandle.getFile().then(file => {
        file.text().then(text => {
            fileEditor.value = text;
            fileEditor.disabled = false;
        });
    });

    saveButton.onclick = async() => {
        if (fileHandle) {
            const writable = await fileHandle.createWritable();
            await writable.write(fileEditor.value);
            await writable.close();
            alert('File saved successfully.');
        }
        editorContainer.style.display = 'none';
    };

    cancelButton.onclick = () => {
        editorContainer.style.display = 'none';
    };
}

async function moveToTrash(fileName) {
    try {
        const fileHandle = fileHandles.get(fileName);
        if (fileHandle && trashDirectoryHandle) {
            const newHandle = await trashDirectoryHandle.getFileHandle(fileName, {
                create: true
            });
            const file = await fileHandle.getFile();
            const writable = await newHandle.createWritable();
            await writable.write(await file.arrayBuffer());
            await writable.close();
            await fileHandle.remove();
            fileHandles.delete(fileName);
            alert('File moved to trash successfully.');
            // Refresh content after deletion
            loadSavedFolder();
        }
    } catch (err) {
        console.error("Error moving file to trash:", err);
    }
}



importFile.addEventListener('click', chooseAFile);
importFolder.addEventListener('click', chooseAFolder);