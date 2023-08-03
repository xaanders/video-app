import Head from 'next/head'
import MediaUploader from '@/components/MediaUploader'
import Image from 'next/image'
import classes from './styles.module.css'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// import VimeoPlayer from 'react-player/vimeo';

const VimeoPlayer = dynamic(() => import('react-player/vimeo'), { ssr: false });

export default function Home() {
  const [isAllowed, setIsAllowed] = useState(false)

  const clickHandler = (e) => {
    console.log('click modal')
  }
  return (
    <>
      <Head>
        <title>Vimeo App Test</title>
        <meta name="description" content="vimeo app test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <h1>hello</h1>
        <div>
          <MediaUploader />

        </div>
        <div style={{ margin: '200px' }}>
          {/* <VimeoPlayer
            className={classes['react-player']}
            url='https://vimeo.com/851312045'
            width='800px'
            height='500px'
            controls={isAllowed}
            fallback={true}
            onClick={!isAllowed && clickHandler}
          /> */}
        </div>
      </main>
    </>
  )
}
