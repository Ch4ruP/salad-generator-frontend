 'use client'
import axios from 'axios';
import { useState, useLayoutEffect } from "react";
import { useSearchParams } from 'next/navigation';
import FoodSvg from './foodSvgs';

interface foodButtonProps {
    groupName: string,
    groupSize: number,
    initialGroup: {key: number , value:React.JSX.Element}[] | null,
    counter: number
}

export default function AddFoodButton(props: foodButtonProps) {
        
    const [idCounter,setIdCounter] = useState(props.counter);
    const [foodEl,setFoodEl] = useState(props.initialGroup);
    const searchParams = useSearchParams();
    const userAllergies: { id: number; value: string }[] = searchParams.getAll("allergiesCheckbox").map((allergy: string, index: number): { id: number; value: string } => {return {id: index, value: allergy}})
    const restriction = searchParams.get("dietaryReqsRadioBtn")
    const restrMap = (function () {
        switch (restriction) {
            case "Vegan":
            return 4;
            case "Vegetarian":
            return 3;
            case "Pescatarian":
            return 2;
            default:
            return 1;
        }
        })();

    async function getIngredient(foodGroup: string): Promise<string> {
        try {
            let userData = {
                category: foodGroup,
                allergies: userAllergies,
                restrs: restrMap
            }
            const response = await axios.post('http://localhost:5432/getIngredient', {data: userData})
            if(response.data) { return response.data.name } else { return "No Options" }
        } catch (error) {
            console.error(error);
            return "Unable to find"
        }
    }

    const onclick =  async () => {
        const ingredient = await getIngredient(props.groupName);
        const foodToAdd: {key: number , value:React.JSX.Element} = {
            key: idCounter,
            value: 
                <div className="food-option" key={idCounter}>
                <div className="food-svgs">
                    <FoodSvg className='dropdown' groupName={props.groupName} ingredient={ingredient}/>
                    <FoodSvg className='refresh' groupName={props.groupName} ingredient={ingredient}/>
                    <FoodSvg className='cross' ingredient={ingredient}/>
                    <button className='cross' onClick={() => removeThisFood(idCounter)}></button>
                </div>
                <p className="food-name">{ingredient}</p>
                </div>
        } as const;
        if (foodEl==null) {setFoodEl([foodToAdd]);}
        else {setFoodEl([...foodEl, foodToAdd]);}
        setIdCounter(idCounter+1);
    }

    const removeThisFood = (id: number) => {
        const currentKey: number = id;
        const newFoodEl = foodEl ? foodEl.filter(food => food.key!=currentKey) : foodEl;
        setFoodEl(newFoodEl)
    }
    
    return (<>
        <div className='food-group'>
            <h2 className='food-group-header'>{props.groupName}</h2>
            {foodEl ? foodEl.map(food => food.value) : null}
            <button className='add-new-btn' aria-label={"Add New "+props.groupName} title="Add New" 
            onClick={onclick}>
                <img className='plus' src="/plus.svg" alt={"Add new "+props.groupName}/>
            </button>
        </div>
    </>)
}