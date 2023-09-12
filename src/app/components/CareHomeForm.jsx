"use client";

import Places from "./Places";
import { Wrapper } from "@googlemaps/react-wrapper";
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { getSignature, isExistingCareHome, saveToDatabase } from '../_actions'

//server actions are in _actions.js which makes the private and they are explicitly server side functions that can be called client side components
//creating signed authenticated request to cloudinary
//1.) create signature to send signed req to cloudinary (server side to access secret key)
//2.) Post req to cloudinary from client with uploaded file and signature
//3.) Verify returned public id with signature (server side)
//4.) Save URL/public id to db

export default function CareHomeForm({className}) {
	const [loading, setLoading] = useState(false);
    const [home, setHome] = useState(null);
    const [name, setName] = useState('')
    const [description, setDecscription] = useState('')
    const [rating, setRating] = useState(null)
    const [cost, setCost] = useState(null)
    const [files, setFiles] = useState([]) 
    const [rejected, setRejected] = useState([])
    const [formErrors, setFormErrors] = useState()
    const formRef = useRef(null);

    //useDropZone call onDrop and passes in the accepted/rejected arguments
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      //files already in state will auto pass to the function in the setter (ie setFiles)
      setFiles(previousFiles => [
        // If allowing multiple files
        // ...previousFiles,
        ...acceptedFiles.map(file =>
          //map over files to assign url to show a browser preview ie using browser api to preview not server or cloudinary
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      ])
    }

    //save files in state to display errors and allow user to remove
    if (rejectedFiles?.length) {
      setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
    }
  }, [])

  //set options and then can use the helper functions from useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1000,
    maxFiles: 1, //if loading multiple - loop through files to upload 
    onDrop
  })

  useEffect(() => {
    // Revoke the data uris for the image previews to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  //Helper functions to handle files
  const removeFile = name => {
    setFiles(files => files.filter(file => file.name !== name))
  }

  const removeAll = () => {
    setFiles([])
    setRejected([])
  }

  const removeRejected = name => {
    setRejected(files => files.filter(({ file }) => file.name !== name))
  }

  const error = {  
    nameError: name === name.toLowerCase()?null : 'All characters must be lower case',
    descriptionError: description.match(/[a-z]/gi) || description=== '' ?null : 'Description must include text',
    ratingError:  rating <= 5 && rating >= 0 ? null : 'Rating must be between 0-5',
    costError:  cost >= 0 ? null : 'Cost must be a number greater than 0',
    locationError: home ? null : 'Location required'
    }

    useEffect(() => {
        // Assign the form element once mounted
        formRef.current = document.getElementById('careHomeForm');
      }, []);

    async function action() {
    setLoading(true)
    setFormErrors(Object.values(error).filter(x => x !== null))
    const file = files[0]

    if(formErrors && formErrors.length !== 0 || !file) {
        console.log('Cannot submit due to form validation errors')
        setLoading(false)
        return
    }

    // get signature with server action (instead of api call)
    const { timestamp, signature } = await getSignature()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    formData.append('signature', signature)
    formData.append('timestamp', timestamp)
    formData.append('folder', 'care_homes')

    try {
    //check if care home exists in DB already
    if(home){
        const {lat,lng} = home
        const isExisting = await isExistingCareHome(lat, lng)
        if(isExisting?.result=== true){
            alert('Care home at that location already exists')
            setLoading(false);
            return
        }else if(isExisting?.status === 'error'){
            setLoading(false);
            console.log(error)
        }
    
        // upload to cloudinary with signature
        const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
        const data = await fetch(endpoint, {
          method: 'POST',
          body: formData
        }).then(res => res.json())
        
        // write to database with server action (instead of api)
        const response = await saveToDatabase({
          imageVersion: data?.version,
          clientSignature: data?.signature,
          imagePublicId: data?.public_id,
          imageSecureUrl: data?.secure_url,
          nameLowCase: name,
          lat: lat,
          lng: lng,
          description: description,
          rating: rating,
          cost: cost
        })
        if (response?.status === 'success') {
            console.log("Form submitted successfully");
            formRef.current.reset();
            removeAll()
            setLoading(false);
    
        }else {
            alert(response?.message)
            console.log("Error submitting form");
            setLoading(false);
        }
    
    }else {
        console.log("Error no location submitted");
        setLoading(false);
    }

    } catch (error) {
        console.log("Error",error);
        setLoading(false);
    }
  }

	return (
        <div className="w-screen">
            <div className="w-3/5 mx-auto rounded-lg border-2 border-solid border-slate-900 my-10">

                <form action={action} id="careHomeForm"
                // onSubmit={handleSubmit} 
                className="p-5">
                    <div>
                        <h2 className=" md:text-4xl sm:text-xl font-bold text-pink-300">Add care home</h2>
                    </div>
                    <div className="flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            minLength={3}
                            maxLength={150}
                            required
                            className=" p-4 bg-gray-50 border border-gray-100 "
                            autoComplete="off"
                            id="name"
                            onChange={e => setName(e.target.value)}
                        />
                        <div style={{color: 'red'}}>{error.nameError}</div>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="image">
                            Image
                        </label>
                        <div
                        // getRootProps for drag area from useDropZone
                            {...getRootProps({
                            className: className
                            })}
                        >
                            {/* getInputProps for input area type='file' from useDropeZone*/}
                            <input {...getInputProps({ name: 'file' })} />
                            <div className='flex flex-col items-center justify-center gap-4 bg-gray-50 py-4'>
                            <ArrowUpTrayIcon className='h-5 w-5 fill-current' />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag & drop files here, or click to select files</p>
                            )}
                            </div>
                        </div>

                        {/* Preview */}
                        <section className='mt-10'>
                            <div className='flex gap-4'>
                            <button
                                type='button'
                                onClick={removeAll}
                                className='mt-1 rounded-md border border-rose-400 p-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
                            >
                                Remove all files
                            </button>
                            {/* <button
                                type='submit'
                                className='ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white'
                            >
                                Upload to Cloudinary
                            </button> */}
                            </div>

                            {/* Accepted files */}
                            <h3 className='title mt-10 border-b text-slate-800 font-bold'>
                            Accepted Files
                            </h3>
                            <ul className='mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 '>
                            {files.map(file => (
                                <li key={file.name} className='relative h-32 rounded-md shadow-lg '>
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    width={100}
                                    height={100}
                                    onLoad={() => {
                                    URL.revokeObjectURL(file.preview)
                                    }}
                                    className='h-full w-full rounded-md object-contain'
                                />
                                <button
                                    type='button'
                                    className='absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white'
                                    onClick={() => removeFile(file.name)}
                                >
                                    <XMarkIcon className='h-5 w-5 fill-white transition-colors hover:fill-rose-400' />
                                </button>
                                <p className='mt-2 text-[12px] font-medium text-stone-500'>
                                    {file.name}
                                </p>
                                </li>
                            ))}
                            </ul>

                            {/* Rejected Files */}
                            <h3 className='title mt-24 border-b font-bold text-slate-800'>
                            Rejected Files
                            </h3>
                            <ul className='mt-6 flex flex-col'>
                            {rejected.map(({ file, errors }) => (
                                <li key={file.name} className='flex items-start justify-between'>
                                <div>
                                    <p className='mt-2 text-sm font-medium text-stone-500'>
                                    {file.name}
                                    </p>
                                    <ul className='text-[12px] text-red-400'>
                                    {errors.map(error => (
                                        <li style={{color: 'red'}} key={error.code}>{error.message}</li>
                                    ))}
                                    </ul>
                                </div>
                                <button
                                    type='button'
                                    className='mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
                                    onClick={() => removeRejected(file.name)}
                                >
                                    remove
                                </button>
                                </li>
                            ))}
                            </ul>
                        </section>

                    </div>
                    <div className="w-full flex flex-col my-4 mt-6s">
                        <label className="font-bold text-slate-800" htmlFor="location">
                            Location
                        </label>
                        <Wrapper
                            apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
                            version="beta"
                            libraries={["marker","places"]}
                        >
                        <Places
                            setHome={(position) => {
                                setHome(position);
                            }}
                        />
                        </Wrapper>
                        <div style={{color: 'red'}}>{error.locationError}</div>
                    </div>
                    <div>
                        <label className="font-bold text-slate-800" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            required
                            minLength={3}
                            maxLength={500}
                            name="description"
                            className="w-full p-4 bg-gray-50 border border-gray-100 "
                            onChange={e => setDecscription(e.target.value)}
                        />
                        <div style={{color: 'red'}}>{error.descriptionError}</div>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="rating">
                            Rating
                        </label>
                        <input
                            type="text"
                            minLength={1}
                            maxLength={3}
                            required
                            className=" p-4 bg-gray-50 border border-gray-100 "
                            autoComplete="off"
                            id="rating"
                            onChange={e => setRating(e.target.value)}
                        />
                        <div style={{color: 'red'}}>{error.ratingError}</div>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="cost">
                            Cost per week
                        </label>
                        <input
                            type="text"
                            minLength={1}
                            maxLength={10}
                            required
                            className=" p-4 bg-gray-50 border border-gray-100 "
                            autoComplete="off"
                            id="cost"
                            onChange={e => setCost(e.target.value)}
                        />
                        <div style={{color: 'red'}}>{error.costError}</div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 w-40 disabled:bg-gray-400 disabled:text-gray-100 text-white font-medium mt-4 hover:text-pink-300 bg-slate-900 rounded-lg">
                        Submit
                    </button>
                </form>
            </div>
            
        </div>
		
	);
}
