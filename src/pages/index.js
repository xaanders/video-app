import Head from 'next/head'
import MediaUploader from '@/components/MediaUploader'
import Image from 'next/image'
import classes from './styles.module.css'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const VimeoPlayer = dynamic(() => import('react-player/vimeo'), { ssr: false });
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function Home({ videos }) {
  const [isAllowed, setIsAllowed] = useState(false)
  console.log(videos)
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
          {
            videos.length > 0 &&
            videos.map(item => {
              return (
                <div>
                  <h1>{item.name}</h1>
                  <p>{item.description}</p>
                  <ReactPlayer
                    className={classes['react-player']}
                    url={`https://vimeo.com/${item._id}`}
                    width='800px'
                    height='500px'
                    controls
                  />
                </div>
              )

            })
          }
        </div>
      </main>
    </>
  )
}


export async function getServerSideProps() {
  const { data } = await axios.get('http://localhost:3000/api/videos');

  return { props: { videos: data.videos } }
}