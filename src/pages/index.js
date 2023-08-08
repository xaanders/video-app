import Head from 'next/head'
import MediaUploader from '@/components/MediaUploader'
import Image from 'next/image'
import classes from './styles.module.css'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { removingVideo } from '@/helpers/ManagingVideo';

const VimeoPlayer = dynamic(() => import('react-player/vimeo'), { ssr: false });
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function Home({ videos, error }) {
  const [isAllowed, setIsAllowed] = useState(false)
  const [currentVideos, setCurrentVideos] = useState(videos);


  const clickHandler = (e) => {
    console.log('click modal')
  }

  if (error) {
    return <div>{error}</div>
  }
  const removeHandler = (id) => {
    removingVideo({ id });
    setCurrentVideos(prev => prev.filter(item => item._id !== id))
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
            currentVideos.length > 0 &&
            currentVideos.map(item => {
              return (
                <div key={item.name} style={{ margin: '30px', border: '1px solid white' }}>
                  <h1>{item.name}</h1>
                  <p>{item.description}</p>
                  <button onClick={removeHandler.bind(this, item._id)} style={{ margin: '30px' }}>delete</button>
                  <ReactPlayer
                    className={classes['react-player']}
                    url={`https://vimeo.com/${item._id}`}
                    width='800px'
                    height='500px'
                    controls
                  />
                  {item.image && 
                  <Image width={300} height={300} src={item.image} alt="Video Thumbnail" />}
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
  const { data: picData } = await axios.get('http://localhost:3000/api/pictures');
  console.log(picData);


  if (data.error) {
    return { props: { videos: [], error: data.error } }
  }


  return { props: { videos: data.videos || [] } }
}