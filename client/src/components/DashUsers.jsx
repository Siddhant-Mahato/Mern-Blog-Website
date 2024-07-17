

import { Button,Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { FaCircleExclamation } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";



const DashUsers = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);

    const [showMore, setShowMore] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [userIdToDelete, setUserIdToDelete] = useState("");



    useEffect(() => {
        const fetchUsers = async () => {
            try
            {
                const res = await fetch(`/api/user/getusers?`);

                const data = await res.json();

                if (res.ok)
                {
                    setUsers(data.users);
                    if (data.users.length < 9)
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
            fetchUsers();
        }
    }, [currentUser._id]);


    const handleShowMore = async () => {

        const startIndex = users.length;

        try
        {

            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);

            const data = await res.json();

            if (res.ok)
            {
                setUsers((prev) => [...prev, ...data.users]);

                if (data.users.length < 9)
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


    const handleDeleteUser = async () => {
        try
        {
            const res = await fetch(`/api/delete/${userIdToDelete}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>

                            <Table.HeadCell>User Image</Table.HeadCell>

                            <Table.HeadCell>Username</Table.HeadCell>

                            <Table.HeadCell>Email</Table.HeadCell>

                            <Table.HeadCell>Admin</Table.HeadCell>

                            <Table.HeadCell>
                                <span className=''>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        <Table.Body className='divide-y'>
                            {users.map((user) => (
                                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>

                                    <Table.Cell>
                                        
                                        
                                        <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover rounded-full bg-gray-500' />


                                    </Table.Cell>

                                    <Table.Cell>
                                        
                                        {user.username}

                                    </Table.Cell>

                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.isAdmin ?( <FaCheck className='text-green-500'/>):(<FaTimes className='text-red-500'/>) }</Table.Cell>

                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                            setShowModal(true);
                                            setUserIdToDelete(user._id);
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
                <h2>You have no user yet !</h2>
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
                            Are you sure you want to delete this user?
                        </h3>
                            
                        <div className="flex justify-center gap-4">
                        
                            <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
