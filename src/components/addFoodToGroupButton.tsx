 'use client'
import axios from 'axios';
import { useState } from "react";
import { useSearchParams } from 'next/navigation';


interface foodButtonProps {
    groupName: string,
    initialGroup: React.JSX.Element[]
}

export default function AddFoodButton(props: foodButtonProps) {

    const [foodEl,setFoodEl] = useState(props.initialGroup)
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
        setFoodEl([
          ...foodEl,
          <div className="food-option">
            <div className="food-svgs">
                <img className="dropdown -logo" src="/dropdown.svg" alt={"Select a different "+props.groupName}/>
                <img className="refresh"src="/refresh.svg" alt={"Refresh salad with a random new "+props.groupName}/>
                <img className="cross" src="/cross.svg" alt={"Remove "+props.groupName}/>
            </div>
            <p className="food-name">{await getIngredient(props.groupName)}</p>
        </div>
        ])
    }

    return (<>
        {foodEl}
        <button className='add-new-btn' aria-label={"Add New "+props.groupName} title="Add New" 
        onClick={onclick}>
            <img className='plus' src="/plus.svg" alt={"Add new "+props.groupName}/>
        </button>
    </>)
}