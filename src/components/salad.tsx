import '@/styles/saladPage.css'
import InitialFoodGroup from './foodGroup';


export default function Salad() {
    const saladComps: {value: string, quantity: number }[] = [{value:"Grain",quantity:1},{value:"Greens",quantity:1},{value:"Fruit & Veg",quantity:3},{value:"Protein",quantity:1},{value:"Toppings",quantity:2},{value:"Dressing",quantity:1}]
    const foodGroups: Promise<React.JSX.Element>[] = saladComps.map(async (foodGroup: {value: string, quantity: number }): Promise<React.JSX.Element> => (
        <InitialFoodGroup groupName={foodGroup.value} groupSize={foodGroup.quantity}></InitialFoodGroup>
    )) 
    return(<>
    {foodGroups}
    </>)
}