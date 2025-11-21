import Image from "next/image";
import SaladRestrictions from '@/components/saladRestrictions';
import Salad from "@/components/salad";
import styles from "@/styles/page.module.css"

export default function SaladPage() {
  return (<div className={styles.page}>
  <main className={styles.main}>
    <div className={styles.intro}>
        <Image
        className={styles.logo}
        src="/salad.svg"
        alt="Salad Generator logo"
        width={200}
        height={200}
        priority
        />
        <h1>Salad Generator</h1>
    </div>
    <div className="ctas">
        <h2 className='dietary-header'>Dietary Requirements: </h2>
        <SaladRestrictions/>
    </div>
    <Salad/>
  </main>
  </div>)
}