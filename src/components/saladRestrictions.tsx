'use client'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/styles/saladPage.css'


export default function SaladRestrictions() {
    const searchParams = useSearchParams();
    const userAllergies: { id: number; value: string }[] = searchParams.getAll("allergiesCheckbox").map((allergy: string, index: number): { id: number; value: string } => {return {id: index, value: allergy}})
    const allergiesList: React.JSX.Element[] = userAllergies.map((allergy: { id: number; value: string }): React.JSX.Element => (
        <span key={allergy.id}>{allergy.value}</span>
    ))
    const restriction = searchParams.get("dietaryReqsRadioBtn") && searchParams.get("dietaryReqsRadioBtn")!=="None" ? <span className='restr-element'>{searchParams.get("dietaryReqsRadioBtn")}</span> : null
    
    return(<>
        {restriction}
        {allergiesList}
        <Link className='go-back-link' href="/">Edit</Link>
    </>)
}