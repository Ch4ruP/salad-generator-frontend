'use client'
import "@/styles/restrictions.css"
import React from "react";
import { useState } from 'react'
 
interface AllergiesProps {
  /** The text to display inside the checkboxes */
  allergyList: { id: number; value: string }[];

}

export default function Allergies({allergyList}: AllergiesProps) {
    const [checkedState, setCheckedState] = useState(new Array(allergyList.length).fill(false) as Array<boolean>);

    const handleChange = (pos: number) => {
        const updatedCheckedState = checkedState.map((test,index: number) => index===pos ? !checkedState[index] : checkedState[index]);
        setCheckedState(updatedCheckedState);
    }

    const checkboxList: React.JSX.Element[] = allergyList.map((allergy: { id: number; value: string }, index: number): React.JSX.Element => (
        <label htmlFor={allergy.value} key={allergy.id}>
            <input 
                id={allergy.value} 
                type="checkbox" 
                checked={checkedState[index]} 
                value={allergy.value} 
                name="allergiesCheckbox"
                tabIndex={0}
                onChange={() => handleChange(index)}
            />
            {allergy.value}
        </label>
    )); 
    return (<>
        {checkboxList}
    </>)
}