// import { Table } from 'flowbite-react';
// import React, { useEffect, useState } from 'react'
// import { useSelector } from "react-redux";
// import { Link } from 'react-router-dom';

// const DashPosts = () => {

//     const { currentUser } = useSelector((state) => state.user);

//     const [userPosts, setUserPosts] = useState([]);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try
//             {
//                 const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);

//                 const data = await res.json();

//                 if (res.ok)
//                 {
//                     setUserPosts(data.posts);
//                     // if (data.posts.length < 9)
//                     // {
//                     //     setShowMore(false);
//                     // }
//                 }

//             }
//             catch (error)
//             {
//                 console.log(error.message);
//             }
//         };

//         if (currentUser.isAdmin) {
//             fetchPosts();
//         }
        

//     }, [currentUser._id]);

// return (
//     <div>
//         {
//             currentUser.isAdmin && userPosts.length > 0 ? (

//                 <>
//                     <Table hoverable className='shadow-md'>
                        
//                         <Table.Head>
                            
//                             <Table.HeadCell>Date Updatetd</Table.HeadCell>

//                             <Table.HeadCell>Post Image</Table.HeadCell>

//                             <Table.HeadCell>Post Title</Table.HeadCell>

//                             <Table.HeadCell>Category</Table.HeadCell>

//                             <Table.HeadCell>Delete</Table.HeadCell>

//                             <Table.HeadCell>
//                                 <span className=''>Edit</span>
//                             </Table.HeadCell>

//                         </Table.Head>

//                         {userPosts.map((post) => {
//                             <Table.Body>
//                                 <Table.Row >
                                    
//                                     <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

//                                     <Table.Cell>
//                                         <Link to={`/post/${post.slug}`}>
//                                             <img src={post.image} alt={post.title} className='w-20 h-10 object-contain bg-gray-500' />
//                                         </Link>
//                                     </Table.Cell>

//                                     <Table.Cell>{post.title}</Table.Cell>

//                                     <Table.Cell>{post.category}</Table.Cell>

//                                     {/* <Table.Cell>
//                                         <button onClick={() => deletePost(posts._id)}>Delete</button>
//                                     </Table.Cell>

//                                     <Table.Cell>
//                                         <button onClick={() => editPost(posts)}>Edit</button>
//                                     </Table.Cell> */}

//                                 </Table.Row>

//                             </Table.Body>
//                         })}
//                     </Table>
//                 </>
                
//             ): (
//                     <h2>No posts found</h2>
//             )
//         }
//     </div>
// )
// }

// export default DashPosts




import { Button,Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { FaCircleExclamation } from "react-icons/fa6";

const DashPosts = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [userPosts, setUserPosts] = useState([]);

    const [showMore, setShowMore] = useState(true);
    
    const [showModal, setShowModal] = useState(false);

    const [postIdToDelete, setPostIdToDelete] = useState("");



    useEffect(() => {
        const fetchPosts = async () => {
            try
            {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);

                const data = await res.json();

                if (res.ok)
                {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9)
                    {
                        setShowMore(false);
                    }
                }
            }
            catch (error)
            {
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin)
        {
            fetchPosts();
        }
    }, [currentUser._id]);


    const handleShowMore = async () => {

        const startIndex = userPosts.length;

        try
        {

            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);

            const data = await res.json();

            if (res.ok)
            {
                setUserPosts((prev) => [...prev, ...data.posts]);

                if (data.posts.length < 9)
                {
                    setShowMore(false);
                }
            }
        }

        catch (error)
        {
            console.log(error.message);
        }
    };


    const handleDeletePost = async () => {

        setShowModal(false);

        try
        {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok)
            {
                console.log(data.message);
            }

            else
            {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            }
        }

        catch (error)
        {
            console.log(error.message);
        }
    };


    return (
        <div className='table-auto overflow-x-scroll w-full p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>

                            <Table.HeadCell>Post Image</Table.HeadCell>

                            <Table.HeadCell>Post Title</Table.HeadCell>

                            <Table.HeadCell>Category</Table.HeadCell>

                            <Table.HeadCell>Delete</Table.HeadCell>

                            <Table.HeadCell>
                                <span className=''>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        <Table.Body className='divide-y'>
                            {userPosts.map((post) => (
                                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                                    <Table.Cell>
                                        
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt={post.title} className='w-20 h-10 object-contain bg-gray-500' />
                                        </Link>

                                    </Table.Cell>

                                    <Table.Cell>
                                        
                                        <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                                            {post.title}
                                        </Link>

                                    </Table.Cell>

                                    <Table.Cell>{post.category}</Table.Cell>

                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id);
                                        }}>Delete</span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        
                                        <Link to={`/update-post/${post._id}`} >
                                            <span className='text-teal-500 hover:underline'>Edit</span>
                                        </Link>
                                        
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>

                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                                Show More
                            </button>
                        )
                    }
                </>
            ) : (
                <h2>No posts found</h2>
            )}

            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                popup
                size="md"
            >
                <Modal.Header />

                <Modal.Body>
                    <div className="text-center">
                        
                        <FaCircleExclamation className="h-14 w-14 bg-transparent text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this post?
                        </h3>
                            
                        <div className="flex justify-center gap-4">
                        
                            <Button color="failure" onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>
                            
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                            
                        </div>
                        
                    </div>
                </Modal.Body>
            </Modal>
        </div>


    );
};

export default DashPosts;
