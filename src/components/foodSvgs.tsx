// 3. Should be a button element
// 4. On click should carry out the action - e.g. dropdown shows more options
interface svgProps {
    className: string,
    groupName?: string,
    ingredient: string
}

export default function FoodSvg(props: svgProps) {

    const getSrcName = (function () {
        switch (props.className) {
            case "dropdown":
            return "/dropdown.svg";
            case "refresh":
            return "/refresh.svg";
            case "cross":
            return "/cross.svg";
        }
    })();

    const getAltName = (function () {
        switch (props.className) {
            case "dropdown":
            return "Choose a different "+props.groupName+"- currently "+props.ingredient;
            case "refresh":
            return "Refresh salad with a random new "+props.groupName+"- currently "+props.ingredient;
            case "cross":
            return "Remove "+props.ingredient;
        }
    })();

    return (<img className={props.className} src={getSrcName} alt={getAltName}/>)
}


