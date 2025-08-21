import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: 'difdfhkst',
    api_key: '825719528188969',
    api_secret: 'SWl_q2mwfqie8MLzfWa3e6vCtaw'
});

export default cloudinary;
