import axios from 'axios';
import AddFoodButton from '@/components/addFoodToGroupButton';
import FoodSvg from './foodSvgs';

interface foodGroupProps {
    groupName: string,
    groupSize: number,
}

export default async function FoodGroup(props: foodGroupProps) {

    async function getIngredient(foodGroup: string): Promise<string> {
        try {
            let userData = {
                category: foodGroup,
                allergies: ["None"],
                restrs: 2
            }
            const response = await axios.post('http://localhost:5432/getIngredient', {data: userData})
            if(response.data) { return response.data.name } else { return "No Options" }
        } catch (error) {
            console.error(error);
            return "Unable to find"
        }
    }

    var foodEl: {key: number , value:React.JSX.Element}[] = [];
    var idCounter = 0;
    for(let i = 0; i<props.groupSize;i++){
        const ingredient = await getIngredient(props.groupName);
        foodEl.push({
            key: idCounter,
            value: 
                <div className="food-option">
                 <div className="food-svgs">
                    <FoodSvg className='dropdown' groupName={props.groupName} ingredient={ingredient}/>
                    <FoodSvg className='refresh' groupName={props.groupName} ingredient={ingredient}/>
                    <FoodSvg className='cross' ingredient={ingredient}/>
                 </div>
                 <p className="food-name">{ingredient}</p>
                </div>
        })
        idCounter++;

    }

    return(<>
       <AddFoodButton groupName={props.groupName} groupSize={props.groupSize} initialGroup={foodEl} counter={idCounter}/>
    </>)
}