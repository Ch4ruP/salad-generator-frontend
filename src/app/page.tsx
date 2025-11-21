import Image from "next/image";
import styles from "styles/page.module.css";
import RestrictionsForm from "@/components/restrictions";

export default function Home() {

  return (
    <div className={styles.page}>
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
        <RestrictionsForm/>
      </main>
    </div>
  );
}
