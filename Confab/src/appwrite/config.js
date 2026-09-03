import conf from "../conf.js";
import { Client, ID, Databases, Storage, Query} from "appwrite";

export class blogPost{
    Client = new Client();
    databases;
    storage;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.databases = new Databases(this.Client);
        this.storage = new Storage(this.Client);
    }

    async createPost({title,content,featured_image,status,user_id}){
            try{
                return await this.databases.createDocument(conf.databaseId,conf.collectionId,ID.unique(),{
                    title,
                    content,
                    featured_image,
                    user_id
                })
            }
            catch(error){
                console.log(error);
            }
    }

    async updatepost(ID,{title,content,featured_image,status,userId}){
        try{
            return await this.databases.updateDocument(conf.databaseId,conf.collectionId,ID,{
                title,
                content,
                featured_image,
                status
            })
        }
        catch(error){
            console.log(error);
        }
    }

    async deletePost(ID){
        try{
            return await this.databases.deleteDocument(conf.databaseId,conf.collectionId,ID);
        }
        catch(error){
            console.log(error);
        }
    }

    async getPost(ID){
        try{
            return await this.databases.getDocument(conf.databaseId,conf.collectionId,ID);
        }
        catch (error){
            console.log(error);
        }
    }

    async getPosts(queries = [Query.limit(10), Query.orderAsc('$createdAt')]){
        try{
            return await this.databases.listDocuments(conf.databaseId,conf.collectionId,queries);
        }
        catch (error){
            console.log(error);
        }
    }
};

const blogpost = new blogPost();

export default blogpost;
