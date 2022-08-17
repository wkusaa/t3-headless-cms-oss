import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import axios from 'axios';



const Main: NextPage = () => {

    const [files, setFiles] = useState<FileList | null>(null!);
    const { mutateAsync: createPresignedUrl } = trpc.useMutation('oss.createPresignedUrl');
    const { mutateAsync: createSignedUrl } = trpc.useMutation('oss.createSignedUrl');
    const uploadStuff = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!files) return;

        const presignedUrl = await createPresignedUrl();
        console.log(presignedUrl);

        console.log("file", files);
        const formData = new FormData();
        formData.append('key', presignedUrl.dir + files[0]?.name);
        formData.append('success_action_status', '200');
        formData.append('policy', presignedUrl.policy);
        formData.append('OSSAccessKeyId', presignedUrl.accessid);
        formData.append('Signature', presignedUrl.signature);
        formData.append('file', files[0]!);


        // for (let index = 0; index < files.length; index++) {
        //     formData.append('file[]', files[index]!);
        //     console.log(files[index]);
        // }



        const config = {headers: {'Accept':'application/json', 'Content-Type': 'multipart/form-data;' }};
        let result = new Promise(async (resolve, reject) => {
            await axios.post(presignedUrl.host, formData, config).then( async (res) => {
                console.log(res)
                if (res.status === 200) {
                    resolve(await createSignedUrl({key: formData?.get('key') as string}))
                    // resolve(presignedUrl.host +'/' + formData?.get('key'))
                } else {
                    reject(res)
                }
            });
        });

        console.log(await result);

    }

    const onFileChange = async (e: React.FormEvent<HTMLInputElement>) => {
        setFiles(e.currentTarget.files);
        console.log(e.currentTarget.files);
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="gap-4 h-screen container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
                    Create <span className="text-purple-300">T3</span> App
                </h1>
                <div className='flex flex-col'>
                    <form onSubmit={uploadStuff} className='flex flex-col gap-4'>
                        <h1 className='text-2xl font-extrabold leading-normal'>Upload Stuff</h1>
                        <div className='flex gap-4'>
                            <input onChange={onFileChange} type='file' className='px-2 py-4 bg-gray-300 rounded-md'/>
                            <button type='submit' className='rounded-lg px-4 py-2 bg-purple-300 font-bold'>Upload</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default Main;