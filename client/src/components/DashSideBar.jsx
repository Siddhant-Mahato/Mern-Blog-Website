import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';


const DashSideBar = () => {
    const location = useLocation();

    const [tab, setTab] = useState('');

    const dispatch = useDispatch();


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
            <Sidebar.ItemGroup>
                
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={FaUser} label={'User'} labelColor='dark' as='div' >
                        Profile
                    </Sidebar.Item>
                </Link>


                <Sidebar.Item  icon={GoSignOut} className="" onClick={handleSignout} >
                    Sign out
                </Sidebar.Item>


            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}

export default DashSideBar