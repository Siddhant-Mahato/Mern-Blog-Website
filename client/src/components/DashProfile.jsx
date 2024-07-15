import { Alert, Button, TextInput } from 'flowbite-react'
import { set } from 'mongoose'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL,ref , getStorage, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  // deleteUserStart,
  // deleteUserSuccess,
  // deleteUserFailure,
  // signoutSuccess,
} from "../redux/user/userSlice";

import { useDispatch } from "react-redux";



const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [imageFile, setImageFile] = useState(null)

  const [imageFileUrl, setImageFileUrl] = useState(null)

  const filePickerRef = useRef()

  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)

  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [formData, setFormData] = useState({});
  
  const dispatch = useDispatch();

  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const [updateUserError, setUpdateUserError] = useState(null);

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file)
    {
      setImageFile(e.target.files[0]);
      setImageFileUrl(URL.createObjectURL(file));  // Way to create image file URL from image file
    }

  }

  useEffect(() => {
    if (imageFile) {
      // Upload the image to AWS S3 and get the signed URL and Set the signed URL as the user's profile picture in the database
      uploadImage();
    }
  }, [imageFile])
  
  const uploadImage = async () => {

    setImageFileUploading(true);

    setImageFileUploadError(null);  

    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      },

    );
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id] : e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Change's were made")
      return;
    }

    if (imageFileUploading)
    {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }

    try
    {
      dispatch(updateStart());
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
      {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message)
      }

      else
      {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User updated successfully");
      }
    }
    catch (error)
    {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message)
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
                },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={` rounded-full w-full h-full border-8  border-[lightgray] object-cover ${
              imageFileUploadingProgress && imageFileUploadingProgress < 100 && "opacity-60"
            }`}
          />
        </div>

        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>

        <span className="cursor-pointer">Sign out</span>
      </div>

      {
        updateUserSuccess && (
          <Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>
        )
      }
      {
        updateUserError && (
          <Alert color="failure" className='mt-5'>{updateUserError}</Alert>
        )
      }
    </div>
  );
}

export default DashProfile
