import { createRouter } from "./context";
import { env } from "../../env/server.mjs";
import OSS from 'ali-oss'
import * as trpc from "@trpc/server";
import { z } from 'zod';

const client = new OSS({
    // Specify the region in which the bucket is located. For example, if the bucket is located in the China (Hangzhou) region, set the region to oss-cn-hangzhou. 
    region: env.ALI_REGION,
    // The AccessKey pair of an Alibaba Cloud account has permissions on all API operations. Using these credentials to perform operations in OSS is a high-risk operation. We recommend that you use a RAM user to call API operations or perform routine O&M. To create a RAM user, log on to the RAM console. 
    accessKeyId: env.ALI_ACCESS_KEY_ID,
    accessKeySecret: env.ALI_ACCESS_KEY_SECRET,
    bucket: env.ALI_BUCKET,
});

const config = {
    bucket: env.ALI_BUCKET,
    region: env.ALI_REGION,
    dir: 'files/',
}

async function getSignedUrl(key : string) {
    try {

        const signedUrl = client.signatureUrl(key, { expires: 60 })

        console.log(signedUrl)
        return { signedUrl: signedUrl };
    } catch (e) {
        console.log(e);
    }
}

let count = 0;

export const ossRouter = createRouter()
    .mutation('createPresignedUrl', {
        async resolve({ ctx }) {
            
            if (!ctx.session || !ctx.session.user) {
                throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
            }
            
            const date = new Date();
            date.setDate(date.getDate() + 1);
            const policy = {
              expiration: date.toISOString(),
              conditions: [
                ["content-length-range", 0, 1048576000], // size of contents in bytes
                // { bucket: client.options.bucket } // limit the bucket that can be submitted
              ],
            };

            const postObjectParams = client.calculatePostSignature(policy);
            console.log(postObjectParams);
            const host = `http://${config.bucket}.${(await client.getBucketLocation(config.bucket)).location}.aliyuncs.com`.toString();

            const fields = {
                expire: 3600, // 1 hour in unix
                policy: postObjectParams.policy,
                signature: postObjectParams.Signature,
                accessid: postObjectParams.OSSAccessKeyId,
                host: host,
                dir: config.dir,
            };

            return fields;
        },
    })
    .mutation('createSignedUrl', {
        input: z
        .object({
            key: z.string()
        }),
        async resolve({ input, ctx }) {
            if (!ctx.session || !ctx.session.user) {
                throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
            }
            return getSignedUrl(input.key);
        }
    })
    .query('getFile', {
        input: z
        .object({
            key: z.string()
        }),
        async resolve({ input, ctx }) {
            if (!ctx.session || !ctx.session.user) {
                throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
            }
            return getSignedUrl(input.key);
        }
    })
