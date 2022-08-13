import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect } from 'react';


const Main: NextPage = () => {
    return <div>This is the main page.</div>
}

export default Main;