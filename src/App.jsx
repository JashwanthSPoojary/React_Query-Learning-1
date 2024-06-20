import Postlists from './components/post-lists.jsx';
import './App.css';
import { useState } from 'react';

// The useQuery hook is a part of the react-query library, which 
//is a popular data fetching and caching library for React applications.

function App() {

  const [toggle,setToggle] = useState(true);

  return (
    <>
      {/* npm i @tanstack/react-query */}
      {/* npm i json-server == go to npm website to run  */}
      {/* npm i @tanstack/react-query-devtools */}
      <p className='title'>MY POSTS</p>
      <button onClick={()=> setToggle(!toggle)}>TOGGLE</button>
      {/* && = alternative of ternary operator but accepts only boolean */}
      {toggle && <Postlists/> }
    </>
  )
}

export default App
