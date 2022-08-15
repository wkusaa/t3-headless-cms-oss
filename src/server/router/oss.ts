import { createRouter } from "./context";
import { env } from "../../env/server.mjs";
import OSS from 'ali-oss'
import path from 'path';

// const client = new OSS({
//     // Specify the region in which the bucket is located. For example, if the bucket is located in the China (Hangzhou) region, set the region to oss-cn-hangzhou. 
//     region: env.ALI_REGION,
//     // The AccessKey pair of an Alibaba Cloud account has permissions on all API operations. Using these credentials to perform operations in OSS is a high-risk operation. We recommend that you use a RAM user to call API operations or perform routine O&M. To create a RAM user, log on to the RAM console. 
//     accessKeyId: env.ALI_ACCESS_KEY_ID,
//     accessKeySecret: env.ALI_ACCESS_KEY_SECRET,
//     bucket: env.ALI_BUCKET,
// });

// async function put() {
//     try {
//         // Specify the full paths of the object and the local file. The full path of the OSS object cannot contain the bucket name. 
//         // If the path of the local file is not specified, the local file is uploaded from the path of the project to which the sample program belongs. 
//         const result = await client.put('exampleobject.png', path.normalize('/home/ericn/serverless/oss/src/server/router/avg_8_37.png'));
//         // const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'), { headers });   
//         return result;
//     } catch (e) {
//         console.log(e);
//     }
// }

let count = 0;

export const ossRouter = createRouter()
    .mutation('putFile', {
        async resolve() {
            // const putResult = put();
            count++;
            console.log(count);
            console.log("File is put");
        },
    })
