 'use client'
import axios from 'axios';
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import FoodSvg from './foodSvgs';

interface foodButtonProps {
    groupName: string,
    groupSize: number
}

export default function AddFoodButton(props: foodButtonProps) {

    const [idCounter,setIdCounter] = useState(0);
    const [initFoodEls, setInitFoodEls] = useState<string[]>([]);
    const [foodEl,setFoodEl] = useState<{key: number , value:React.JSX.Element}[] | null>(null);
    const searchParams = useSearchParams();
    const userAllergies: { id: number; value: string }[] = searchParams.getAll("allergiesCheckbox").map((allergy: string,
         index: number): { id: number; value: string } => {return {id: index, value: allergy}})
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

    useEffect(() => {
        // declare the async data fetching function
        setInitFoodEls([]);
        // setFoodEl([]);
        const fetchfoodElems = async () => {
            let initFoodEls: string[] = [];
            for (let i = 0; i < props.groupSize; i++ ) {
                const ingredient = await getIngredient(props.groupName);
                initFoodEls.push(ingredient);
            setInitFoodEls([...initFoodEls]);
            }
        }

        // call the function
        fetchfoodElems()
        // make sure to catch any error
        .catch(console.error);
    }, []);

    useEffect(() => {
        console.log(foodEl?.toString())
        let tempFoodEls = [];
        for (let i = 0; i < props.groupSize; i++) {
            const newIngredient = initFoodEls[i];
            const newFoodEl: {key: number , value:React.JSX.Element} = {
                key: i,
                value: 
                    <div className="food-option" key={i}>
                    <div className="food-svgs">
                        <FoodSvg className='dropdown' groupName={props.groupName} ingredient={newIngredient}/>
                        <button className='refresh-btn svg-btn' onClick={() => updateIngredient(i)} aria-label="Refresh">
                            <FoodSvg className='refresh' groupName={props.groupName} ingredient={newIngredient}/>
                        </button>                        
                        <button className='cross-btn svg-btn' onClick={() => removeThisFood(i)} aria-label="Remove ">
                            <FoodSvg className='cross' ingredient={newIngredient}/>
                        </button>
                    </div>
                    <p className="food-name">{newIngredient}</p>
                    </div>
            };
            tempFoodEls.push(newFoodEl);
        }
        setFoodEl(tempFoodEls);
        setIdCounter(props.groupSize);    
    },[initFoodEls]);

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

    const addNewFood =  async () => {
        const ingredient = await getIngredient(props.groupName);
        const foodToAdd: {key: number , value:React.JSX.Element} = {
            key: idCounter,
            value: 
                <div className="food-option" key={idCounter}>
                <div className="food-svgs">
                    <FoodSvg className='dropdown' groupName={props.groupName} ingredient={ingredient}/>
                    <button className='refresh-btn svg-btn' onClick={() => updateIngredient(idCounter)} aria-label="Refresh">
                        <FoodSvg className='refresh' groupName={props.groupName} ingredient={ingredient}/>
                    </button>
                    <button className='cross-btn svg-btn' onClick={() => removeThisFood(idCounter)} aria-label="Remove">
                        <FoodSvg className='cross' ingredient={ingredient}/>
                    </button>
                </div>
                <p className="food-name">{ingredient}</p>
                </div>
        };
        if (foodEl==null) {setFoodEl([foodToAdd]);}
        else {setFoodEl([...foodEl, foodToAdd]);}
        setIdCounter(idCounter+1);
    }

    const removeThisFood = (key: number) => {
        const currentKey: number = key;
        setFoodEl(currentFoodEl => (currentFoodEl == null)? null : currentFoodEl.filter(food => food.key !== currentKey));
    }

    async function updateIngredient(key: number) {
        const currentKey: number = key;
        const currentFoodEl = foodEl?.filter(food => food.key === currentKey);
        if (currentFoodEl) {
            const newIngredient = await getIngredient(props.groupName);
            const newFoodEl: {key: number , value:React.JSX.Element} = {
                key: currentKey,
                value: 
                    <div className="food-option" key={currentKey}>
                    <div className="food-svgs">
                        <FoodSvg className='dropdown' groupName={props.groupName} ingredient={newIngredient}/>
                        <button className='refresh-btn svg-btn' onClick={() => updateIngredient(currentKey)} aria-label="Refresh">
                            <FoodSvg className='refresh' groupName={props.groupName} ingredient={newIngredient}/>
                        </button>                        
                        <button className='cross-btn svg-btn' onClick={() => removeThisFood(currentKey)} aria-label="Remove ">
                            <FoodSvg className='cross' ingredient={newIngredient}/>
                        </button>
                    </div>
                    <p className="food-name">{newIngredient}</p>
                    </div>
            };
            setFoodEl(currentFoodEl => (currentFoodEl == null) ? null : currentFoodEl.map(food => food.key===currentKey ? newFoodEl : food))
        } 
    }

    return (<>
        <div className='food-group'>
            <h2 className='food-group-header'>{props.groupName}</h2>
            {foodEl ? foodEl.map(food => food.value) : null}
            <button className='add-new-btn' aria-label={"Add New "+props.groupName} title="Add New" 
            onClick={addNewFood}>
                <img className='plus' src="/plus.svg" alt={"Add new "+props.groupName}/>
            </button>
        </div>
    </>)
}