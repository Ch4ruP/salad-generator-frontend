'use client'
import styles from "styles/page.module.css";
import "@/styles/restrictions.css"
import DietaryReqs from "@/components/dietaryReqs";
import Allergies from "@/components/allergies";
import { useRouter } from 'next/navigation';



const RestrictionsForm = () => {
    const router = useRouter();

    const allergies: { id: number; value: string }[]=[{id:0,value:"Dairy"},{id:1,value:"Nuts"},{id:2,value:"Soy"},{id:3,value:"Seafood"}];

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        const query = new URLSearchParams(formData.entries().toArray().map(([k, v]) => [k, v.toString()])).toString();
        router.push(`/salad?${query}`)
    }

return (<>
    <form className={styles.body} onSubmit={handleSubmit}>
        <h2>To get started, select your dietary requirements</h2>
        <div className={styles.ctas}>
        <DietaryReqs />
        </div>
        <h2>Do you have any allergies?</h2>
        <div className={styles.ctas}>
        <Allergies allergyList = {allergies} />
        </div>
        <button className="create-btn" type="submit">Create My Salad</button>
    </form>
</>)}

export default RestrictionsForm;
