import { Button,Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { FaCircleExclamation } from "react-icons/fa6";




const DashComments = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [comments, setComments] = useState([]);

    const [showMore, setShowMore] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [commentIdToDelete, setCommentIdToDelete] = useState("");



    useEffect(() => {
        const fetchComments = async () => {
            try
            {
                const res = await fetch(`/api/comment/getcomments`);

                const data = await res.json();

                if (res.ok)
                {
                    setComments(data.comments);
                    if (data.comments.length < 9)
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
            fetchComments();
        }
    }, [currentUser._id]);


    const handleShowMore = async () => {

        const startIndex = comments.length;

        try
        {

            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);

            const data = await res.json();

            if (res.ok)
            {
                setComments((prev) => [...prev, ...data.comments]);

                if (data.comments.length < 9)
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


    const handleDeleteComment = async () => {
        try
        {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok)
            {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            }
            else
            {
                console.log(data.message);
            }
        }
        catch (error)
        {
            console.log(error.message);
        }
    };
    


    return (
        <div className='table-auto overflow-x-scroll w-full p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            
                            <Table.HeadCell>Comment content</Table.HeadCell>

                            <Table.HeadCell>Number of likes</Table.HeadCell>

                            <Table.HeadCell>PostId</Table.HeadCell>

                            <Table.HeadCell>UserId</Table.HeadCell>

                            <Table.HeadCell>Delete</Table.HeadCell>

                        </Table.Head>

                        <Table.Body className='divide-y'>
                            {comments.map((comment) => (
                                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>

                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                            setShowModal(true);
                                            setCommentIdToDelete(comment._id);
                                        }}>Delete</span>
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
                <h2>You have no comments yet!</h2>
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
                            Are you sure you want to delete this comment?
                        </h3>
                            
                        <div className="flex justify-center gap-4">
                        
                            <Button color="failure" onClick={handleDeleteComment}>
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

export default DashComments;
