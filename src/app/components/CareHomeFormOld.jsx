
"use client";

import { useEffect, useState } from "react";
import Places from "./Places";
import { Wrapper } from "@googlemaps/react-wrapper";

export default function CareHomeFormOld() {
	const [loading, setLoading] = useState(false);
    const [home, setHome] = useState('');
    const [name, setName] = useState('')
    const [image, setImage] = useState({})
    const [imageExtension, setImageExtension] = useState('')
    const [description, setDecscription] = useState('')
    const [rating, setRating] = useState(null)
    const [cost, setCost] = useState(null)

    const allowedImageExtensions = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']

    const error = {  
        nameError: name === name.toLowerCase()?null : 'All characters must be lower case',
        descriptionError: description.match(/[a-z]/gi) || description=== '' ?null : 'Description must include text',
        ratingError:  rating <= 5 && rating >= 0 ? null : 'Rating must be between 0-5',
        costError:  cost >= 0 ? null : 'Cost must be a number greater than 0',
        imageError: allowedImageExtensions.includes(imageExtension.toLowerCase()) ? null : "File must be: jpg, jpeg, png, gif, webp",
    }

    function handleFileChange(e){
        const fileInput = e.target;
        const file = fileInput.files[0];
        console.log(file)
        if(file){
            setImage(file)
            setImageExtension(file.type)
        }
    }

    let formError
    useEffect(()=>{},[formError])

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);

        const errorValues = Object.values(error); //error values to array to use .some() method below
        //all errors should be null and values should not equal initial state before submission
        formError = errorValues.filter(x => x !== null)

        if(formError && formError.length !== 0) {
            console.log('Cannot submit due to form validation errors')
            setLoading(false)
            return
        }
        const formData = new FormData()
        formData.set( 'name', name)
        formData.set( 'position', home)
        formData.set( 'description', description)
        formData.set( 'rating', rating)
        formData.set( 'cost', cost)
        formData.set( 'image', image)
        console.log('careHomeForm.jsx/component formDATA:', formData)

		const data = {
			name: name,
			position: home,
			description: description,
            rating:  rating,
            cost:  cost,
            image: image,
		};

		const response = await fetch("/api/careHome", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			console.log("Message sent successfully");
			setLoading(false);
			// reset the form
            event.reset()
		}
		if (!response.ok) {
			console.log("Error sending message");
			setLoading(false);
		}
	}
	return (
        <div className="w-screen">
            <div className="w-3/5 mx-auto rounded-lg border-2 border-solid border-slate-900 my-10">

                <form onSubmit={handleSubmit} className="p-5">
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
                        <div style={{color: 'red'}}>{error.nameError2}</div>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="image">
                            Image
                        </label>
                        <input
                            type="file"
                            className=" p-4 bg-gray-50 border border-gray-100 "
                            id="image"
                            onChange={handleFileChange}
                        />
                        <div style={{color: 'red'}}>{error.imageError}</div>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <label className="font-bold text-slate-800" htmlFor="location">
                            Location
                        </label>
                        <Wrapper
                            apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
                            version="beta"
                            libraries={["places"]}
                        >
                        <Places
                            setHome={(position) => {
                                setHome(position);
                            }}
                        />
                        </Wrapper>
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
                        Send Message
                    </button>
                </form>
            </div>
            
        </div>
		
	);
}
