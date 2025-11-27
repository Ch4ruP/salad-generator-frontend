import axios from 'axios';

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
            const response = await axios.get('http://localhost:5432/getIngredient', {data: userData})
            if(response.data) { return response.data.name } else { return "No Options" }
        } catch (error) {
            console.error(error);
            return "Unable to find"
        }
    }

    var foodEl: React.JSX.Element[] = [];
    for(let i = 0; i<props.groupSize;i++){
        foodEl.push(
        <div className="food-option">
            <div className="food-svgs">
                <img className="dropdown -logo" src="/dropdown.svg" alt={"Select a different "+props.groupName}></img>
                <img className="refresh"src="/refresh.svg" alt={"Refresh salad with a random new "+props.groupName}></img>
                <img className="cross" src="/cross.svg" alt={"Remove "+props.groupName}></img>
            </div>
            <p className="food-name">{await getIngredient(props.groupName)}</p>
        </div>)
    }
    return(<>
    <div className='food-group'>
        <h2 className='food-group-header'>{props.groupName}</h2>
        {foodEl}
    </div>
    </>)
}