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
    const [foodEl,setFoodEl] = useState<{key: number, name: string, value:React.JSX.Element}[] | null>(null);
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

    function newIngredientObject(ingredient: string, key: number) {
        const foodToAdd: {key: number, name: string, value:React.JSX.Element} = {
            key: key,
            name: ingredient,
            value: 
                <div className="food-option" key={key}>
                <div className="food-svgs">
                    <button className='dropdown-btn svg-btn' onClick={() => dropdownOptions()} aria-label="Show Other Options">
                        <FoodSvg className='dropdown' groupName={props.groupName} ingredient={ingredient}/>
                    </button>
                    <button className='refresh-btn svg-btn' onClick={() => updateIngredient(key)} aria-label="Refresh">
                        <FoodSvg className='refresh' groupName={props.groupName} ingredient={ingredient}/>
                    </button>
                    <button className='cross-btn svg-btn' onClick={() => removeThisFood(key)} aria-label="Remove">
                        <FoodSvg className='cross' ingredient={ingredient}/>
                    </button>
                </div>
                <p className="food-name">{ingredient}</p>
                </div>
        };
        return foodToAdd
    }

    useEffect(() => {
        setInitFoodEls([]);
        const fetchfoodElems = async () => {
            let initFoodEls: string[] = [];
            for (let i = 0; i < props.groupSize; i++ ) {
                const ingredient = await getIngredient(props.groupName,initFoodEls);
                initFoodEls.push(ingredient);
            setInitFoodEls([...initFoodEls]);
            }
        }

        fetchfoodElems()
        .catch(console.error);
    }, []);

    useEffect(() => {
        let tempFoodEls = [];
        for (let i = 0; i < props.groupSize; i++) {
            const newIngredient = initFoodEls[i];
            const newFoodEl: {key: number, name: string, value:React.JSX.Element} = newIngredientObject(newIngredient,i)
            tempFoodEls.push(newFoodEl);
        }
        setFoodEl(tempFoodEls);
        setIdCounter(props.groupSize);    
    },[initFoodEls]);

    function getCurrentIngredientsAsStrings() {
        return foodEl?.map((el) => el.name)
    }

    async function getIngredient(foodGroup: string, currentIngredients?: string[]): Promise<string> {
        try { 
            const currentIngrs = currentIngredients ?? getCurrentIngredientsAsStrings()
            let userData = {
                category: foodGroup,
                allergies: userAllergies,
                restrs: restrMap,
                currentIngredients: currentIngrs
            }
            const response = await axios.post('http://localhost:5432/getIngredient', {data: userData})
            if(response.data) { return response.data.name } else { return "No Options" }
        } catch (error) {
            console.error(error);
            return "Unable to find"
        }
    }

    async function getIngredients(foodGroup: string): Promise<Object[]|null> {
        try {
            const currentIngrs = getCurrentIngredientsAsStrings()
            let userData = {
                category: foodGroup,
                allergies: userAllergies,
                restrs: restrMap,
                currentIngredients: currentIngrs
            }
            const response = await axios.post('http://localhost:5432/getIngredients', {data: userData})
            let ingredientOptions: Object[] = [];
            if(response.data) { 
                for (let i = 0; i < response.data.length; i++) {ingredientOptions.push(response.data[i].name)};
                return ingredientOptions 
            } else { return null }
        } catch (error) {
            console.error(error);
            return null
        }
    }

    const dropdownOptions = async () => {
        const ingredients = await getIngredients(props.groupName);
        alert(ingredients);
    }
    
    const addNewFood =  async () => {
        const ingredient = await getIngredient(props.groupName);
        const foodToAdd: {key: number, name: string, value:React.JSX.Element} = newIngredientObject(ingredient, idCounter);
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
            const newFoodEl: {key: number, name: string, value:React.JSX.Element} = newIngredientObject(newIngredient,currentKey); 
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