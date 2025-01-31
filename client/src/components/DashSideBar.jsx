import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { HiDocumentText } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BiCommentDetail } from "react-icons/bi";
import { HiChartPie } from "react-icons/hi";




const DashSideBar = () => {
    const location = useLocation();

    const [tab, setTab] = useState('');

    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);



    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl)
        {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    
    const handleSignout = async () => {
        try
        {
            const res = await fetch("/api/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok)
            {
                console.log(data.message);
            }
            else
            {
                dispatch(signoutSuccess());
            }
        }
        catch (error)
        {
            console.log(error.message);
        }
    };

return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                
                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item active={tab === 'dash'} icon={HiChartPie} labelColor='dark' as='div' >
                                Dashboard
                            </Sidebar.Item>
                        </Link>

                    )
                }
                
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={FaUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div' >
                        Profile
                    </Sidebar.Item>
                </Link>


                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=posts'>
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} labelColor='dark' as='div' >
                                Posts
                            </Sidebar.Item>
                        </Link>

                    )
                }

                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark' as='div' >
                                User's
                            </Sidebar.Item>
                        </Link>

                    )
                }

                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item
                                active={tab === 'comments'}
                                icon={BiCommentDetail}
                                as='div'
                            >
                                Comments
                            </Sidebar.Item>
                        </Link>

                    )
                }

            
                <Sidebar.Item  icon={GoSignOut} className="" onClick={handleSignout} >
                    Sign out
                </Sidebar.Item>


            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}

export default DashSideBar