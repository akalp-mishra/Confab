import conf from "../conf.js";
import {Client, ID, Databases, Storage, Query, ImageFormat} from "appwrite";

export class fileUpload{
    Client = new Client();
    databases;
    storage;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.databases = new Databases(this.Client);
        this.storage = new Storage(this.Client);
    }

    async uploadFile(file){
        const fileId = ID.unique();
        const fileObj = {bucketId :conf.bucketId, fileId :fileId, file:file}
        await this.storage.createFile(fileObj);
        return fileId;
    }

    async deleteFile(fileId){
        return await this.storage.deleteFile(conf.bucketId,fileId);
    }

    getFileView(fileId){
        try{
            return this.storage.getFileView(conf.bucketId,fileId);
        }
        catch(error){
            console.log(error);
        }
    }
}

const fileupload = new fileUpload();

export default fileupload;