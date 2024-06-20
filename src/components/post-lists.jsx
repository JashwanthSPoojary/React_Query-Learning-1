import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addPost, fetchPosts, fetchTags } from '../api/api.js';
import { useState } from 'react';

const Postlists = () => {
  // Cached Data ===cached data refers to the data that
  // has been fetched from the server and stored locally in the browser's memory or storage. This cached data is used to avoid refetching the
   //same data from the server every time the component is rendered.
  const [page,setPage ]= useState(1);
  // use to fetch data in get method basically mostly used 
  const { 
    data:postData ,
    isError
    ,error,
    isLoading
   } = useQuery({
    queryKey: ['posts',{page}],
    queryFn: () => fetchPosts(page),
    //Stale time is the time period after which the cached data
    // is considered stale, meaning it's no longer fresh or up-to-date. When the stale time is exceeded, 
    //the cached data is discarded, and the next 
    //time you need that data, it will be refetched from the server.
    staleTime: 1000*60*5,
  });

  const { data:tagsData} = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    //staleTime: Infinity means that the cached data will be cached forever
    staleTime: Infinity,
  })

  //This hook allows you to access the Query Client instance, which 
  //provides various methods to interact with the cache, refetch data, and more.
//   Refetching data when a user clicks a button
// Invalidating cache data when a user logs out
// Clearing the cache when a user navigates away from a page
  const queryClient = useQueryClient();

  const {
    mutate,
    isError:isPostError,
    isPending,
    reset,
    //While useQuery is used for fetching data, useMutation 
    //is used for sending data to the server to create, update, or delete resources.
   } = useMutation({
    //the function that performs the mutation (in this case, addPost)
    mutationFn: addPost,
    //The onMutate function is called before the mutation is sent to the 
    //server. In this case, it returns an object with an id property set to 1.
    // This can be useful for optimistic updates, where you want to update 
    //the UI immediately before the server responds.
    onMutate: () =>{
      return {id:1};
    },
    //a function that is called when the mutation is successful (in this case,
    // invalidates the cache for the posts query)
    onSuccess: () =>{
      //When you invalidate a query, you're telling React Query to discard the
      // cached data for that query and refetch the data from the server the next
      // time the query is executed. This ensures that the data is up-to-date 
      //and reflects any changes made on the server.
      queryClient.invalidateQueries({
      //queryKey: an array of keys that identifies the query to invalidate. In this case, it's 
      //['posts'], which means we're invalidating the cache for the posts query.
      //exact: a boolean that specifies whether to invalidate only the exact
      // query with the given queryKey, or all queries that match the queryKey
      // pattern. In this case, exact: true means we're invalidating only the exact query with the key ['posts'].
        queryKey:['posts'],
        exact:true,
      })
    }
  });

  const handleSubmit =  (e) =>{
    e.preventDefault();

    // taking all the events of form
    const formData = new FormData(e.target);
    // taking the title value with use of formdata
    const title = formData.get('title');
    // creating array which as all keys == has value then filtering it with checkbox having " on " means ticked 
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    )
    if (!title || !tags) return;
    mutate({ id: postData?.data?.length+1, title, tags });
    e.target.reset();
  }

if (isLoading) {
    return <div>Loading...</div>;
}
if (isPending) {
  return <div>Pending...</div>;
}
  

if (isError) {
    return <div>Error: {error.message}</div>;
}
if (isPostError) {
  return <div onClick={()=>reset()}>Unable to Render</div>;
}

if (!postData) {
    return null; // Or any other fallback UI you want to show when data is not available yet
}
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="text"
        placeholder='Enter your post'
        className='postbox'
        name='title'
         />
         <div className="tags">
          {tagsData?.map((tag)=>{
            return(
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag} >{tag}</label>
              </div>
            )
          })}
         </div>
         <button>Post</button>
      </form>
      {/* sets the page using usestate that usestate is used get qureryfn to send request */}
      <div className="pages">
        <button onClick={() => setPage((oldPage) => Math.max(oldPage - 1 , 0))}
          disabled={!postData.prev}>Previous Page</button>
        <span>{page}</span>
        <button onClick={() => setPage((oldPage) => oldPage + 1 )}
        disabled={!postData.next}>Next Page</button>
      </div>
      {postData?.data?.map((post)=>{
          return (
            <div key={post.id} className='post'>
              <div>{post.title}</div>
              {post.tags.map((tag)=>(<span key={tag}>{tag}</span>))}
            </div>
          );
      })}
    </div>
  )
}

export default Postlists