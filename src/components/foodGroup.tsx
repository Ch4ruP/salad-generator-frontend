interface foodGroupProps {
    groupName: String,
    groupSize: number
}

export default function FoodGroup(props: foodGroupProps) {
    var foodEl: React.JSX.Element[] = [];
    for(let i = 0; i<props.groupSize;i++){
        foodEl.push(
        <div className="food-option">
            <div className="food-svgs">
                <img className="dropdown -logo" src="/dropdown.svg" alt={"Select a different "+props.groupName}></img>
                <img className="refresh"src="/refresh.svg" alt={"Refresh salad with a random new "+props.groupName}></img>
                <img className="cross" src="/cross.svg" alt={"Remove "+props.groupName}></img>
            </div>
            <p className="food-name">{props.groupName}</p>
        </div>)
    }
    return(<>
    <h2>{props.groupName}</h2>
    {foodEl}
    </>)
}