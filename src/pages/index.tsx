import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Vendetta Roasting</title>
        <meta name="description" content="Premium coffee roasting company" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Vendetta Roasting</h1>
          <p className={styles.description}>
            Crafting exceptional coffee with passion and precision
          </p>
        </div>
      </main>
    </>
  )
}
