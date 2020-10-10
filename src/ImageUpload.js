import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import {db,storage} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

const handleChange = (e)=>{
    // get the first file
if(e.target.value[0]){
    // set your state image to that.
    setImage(e.target.files[0]);
}
}

const handleUpload = (e)=>{
    // we are creating new folder in images and creating every thing in it.
    // image name is the file name whatever file name we have selected.
    // and putting that image in it.
const uploadTask = storage.ref(`images/${image.name}`).put(image)
uploadTask.on(
    "state_changed",
    (snapshot)=>{
        // how long will it take here is the logic.
        const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
    },
    // 2nd argument.
    (error)=>{
        // error function.
        console.log(error);
    }, 
    // final part of it.
    ()=>{
        // complete function. all of the logic.
        storage
        .ref("images")
        .child(image.name)
        // here we finally getting this url so that we can use it.
        .getDownloadURL()
        .then(url=>{
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption : caption,
                imageUrl : url,
                username : username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
        })
    }
)
}

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder="enter a caption" onChange={event=>setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload;
