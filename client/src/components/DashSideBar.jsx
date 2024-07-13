import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation } from 'react-router-dom';


const DashSideBar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl)
        {
        setTab(tabFromUrl);
        }
    },[location.search]);

return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={FaUser} label={'User'} labelColor='dark' >
                        Profile
                    </Sidebar.Item>
                </Link>


                <Sidebar.Item  icon={GoSignOut} classname="" >
                    Sign out
                </Sidebar.Item>


            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}

export default DashSideBar