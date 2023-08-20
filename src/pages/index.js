import Head from 'next/head'
import { signIn, signOut } from "next-auth/react"
import MediaUploader from '@/components/MediaUploader'
import Image from 'next/image'
import classes from './styles.module.css'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { removingVideo } from '@/helpers/ManagingVideo';
import ChangeThumbnail from '@/components/ChangeThumbnail';
import ChangeDescr from '@/components/ChangeDescr';
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useRouter } from 'next/router'

const VimeoPlayer = dynamic(() => import('react-player/vimeo'), { ssr: false });
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function Home({ videos, error, auth }) {
  const [isAllowed, setIsAllowed] = useState(false)
  const [currentVideos, setCurrentVideos] = useState(videos);
  const [isEdit, setIsEdit] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  if (error) {
    return <div>{error}</div>
  }


  const removeHandler = (id) => {
    removingVideo({ id });
    setCurrentVideos(prev => prev.filter(item => item._id !== id))
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await signIn('credentials', {
        redirect: false,
        email: user.email,
        password: user.password,
        callbackUrl: '/'
      });
      setIsLoading(false);
      if(!res.ok) {
        throw new Error(res.error)
      }
      router.push('/')
    } catch (err) {
      setIsLoading(false);
      console.error(err)
    }
  }
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(newUser)
      const res = await axios.post('/api/auth/signup', newUser)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
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
        {auth.isAuthenticated ?
          <>
            <div>
              <MediaUploader />

            </div>
            <button onClick={() => { signOut() }} style={{margin: "50px"}}>Signout</button>

            <div style={{ margin: '200px' }}>
              {
                currentVideos.length > 0 &&
                currentVideos.map(item => {
                  return (
                    <div key={item.name} style={{ margin: '30px', border: '1px solid white' }}>
                      <button onClick={() => setIsEdit(prev => !prev)}>Edit</button>
                      <button onClick={removeHandler.bind(this, item._id)} style={{ margin: '30px' }}>delete</button>

                      {isEdit ?
                        <>
                          <ChangeDescr title={item.name} description={item.description} id={item._id} />
                        </>
                        :
                        <>
                          <h1>{item.name}</h1>
                          <p>{item.description}</p>
                        </>}
                      <VimeoPlayer
                        className={classes['react-player']}
                        url={`https://vimeo.com/${item._id}`}
                        width='100%'
                        controls
                      />

                      <div>
                        {item.image &&
                          <>
                            <Image width={300} height={300} src={item.image} alt="Video Thumbnail" style={{ border: '1px solid white' }} />
                            {/* <ChangeThumbnail videoId={item._id} /> */}
                          </>}
                      </div>
                    </div>
                  )

                })
              }
            </div>

          </> :
          <>
            <button onClick={() => setIsLogin(prev => !prev)}>Try to login</button>
            <button onClick={() => setIsSignUp(prev => !prev)}>SignUp</button>

            {isLogin &&
              <form onSubmit={loginHandler}>
                <label htmlFor='title' style={{ display: 'block' }}>Email</label>
                <input type="email" id="title" name="email" onChange={(e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                <label htmlFor='password' style={{ display: 'block' }}>Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                <button style={{ margin: "30px" }}>Login</button>
              </form>

            }


            {isSignUp &&
              <form onSubmit={signupHandler}>
                <label htmlFor='name' style={{ display: 'block' }}>Name</label>
                <input type="text" id="name" name="name" onChange={(e) => setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                <label htmlFor='email' style={{ display: 'block' }}>Email</label>
                <input type="email" id="email" name="email" onChange={(e) => setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                <label htmlFor='password' style={{ display: 'block' }}>Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />

                <label htmlFor='password2' style={{ display: 'block' }}>Password2:</label>
                <input type="password" id="password2" name="password2" onChange={(e) => setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }))} />



                <button style={{ margin: "30px" }}>Signup</button>
              </form>

            }
          </>


        }
      </main>

    </>

  )
}

export async function getServerSideProps(context) {
  const { data } = await axios.get('http://localhost:3000/api/updating/videos');
  const picData = await axios.get('http://localhost:3000/api/updating/pictures');
  const session = await getServerSession(context.req, context.res, authOptions)
  console.log(picData.data)
  console.log(session)
  let user = false;

  if (session) {
    user = { isAuthenticated: true }
  }

  if (data.error) {
    return { props: { videos: [], error: data.error, auth: user } }
  }


  return { props: { videos: data.videos || [], auth: user } }
}