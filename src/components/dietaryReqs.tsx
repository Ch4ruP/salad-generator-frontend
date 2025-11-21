'use client'
import "@/styles/restrictions.css"
import { useState, MouseEvent } from 'react'
 
export default function DietaryReqs() {

    const [dietaryReqs, setDietaryReqs] = useState("");

    const handleChange = (event: React.ChangeEvent<unknown>, val: string) => {
        setDietaryReqs(val);
    }

    const handleClick = (ev: MouseEvent<HTMLInputElement>) => {
        if (ev.currentTarget.value !== dietaryReqs) {
        setDietaryReqs(ev.currentTarget.value)
        }
    }
  return (<>
    <label className='dietaryReqsRadioClass' htmlFor="dietary-none">
    <input
        id="dietary-none"
        type="radio"
        name="dietaryReqsRadioBtn"
        value="None"
        onChange={(e) => handleChange}
        onClick={handleClick}
        checked={dietaryReqs==="None"}
        />None</label>
    <label className='dietaryReqsRadioClass' htmlFor="dietary-veggie">
    <input
        id="dietary-veggie"
        type="radio"
        name="dietaryReqsRadioBtn"
        value="Vegetarian"
        onChange={(e) => handleChange}
        onClick={handleClick}
        checked={dietaryReqs==="Vegetarian"}
        />Vegetarian</label>
    <label className='dietaryReqsRadioClass' htmlFor="dietary-vegan">
    <input
        id="dietary-vegan"
        type="radio"
        name="dietaryReqsRadioBtn"
        value="Vegan"
        onChange={(e) => handleChange}
        onClick={handleClick}
        checked={dietaryReqs==="Vegan"}
        />Vegan</label>
    <label className='dietaryReqsRadioClass' htmlFor="dietary-pesc">
    <input
        id="dietary-pesc"
        type="radio"
        name="dietaryReqsRadioBtn"
        value="Pescatarian"
        onChange={(e) => handleChange}
        onClick={handleClick}
        checked={dietaryReqs==="Pescatarian"}
        />Pescatarian</label>
</>)
}
