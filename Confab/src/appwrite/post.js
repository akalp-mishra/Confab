import conf from "../conf.js";
import { Client, ID, Storage,Databases, Query, TablesDB} from "appwrite";

class blogPost{
    Client = new Client();
    tables;
    databases;
    storage;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.tables = new TablesDB(this.Client);
        this.databases = new Databases(this.Client);
        this.storage = new Storage(this.Client);
    }

    async createPost({title,content,featured_image,user_id}){
            try{
                return await this.databases.createDocument(
                    conf.databaseId,
                    conf.postTableId,
                    ID.unique(),
                    {
                        title,
                        content,
                        featured_image,
                        user_id
                    }
                )
            }
            catch(error){
                console.log(error);
            }
    }

    async updatepost(ID,{title,content,featured_image,userId}){
        try{
            return await this.databases.updateDocument(
                conf.databaseId,
                conf.postTableId,
                ID,
                {
                    title,
                    content,
                    featured_image,
                    userId
                }
            )
        }
        catch(error){
            console.log(error);
        }
    }

    async deletePost(ID){
        try{
            return await this.databases.deleteDocument(
                conf.databaseId,
                conf.postTableId,
                ID
            );
        }
        catch(error){
            console.log(error);
        }
    }

    async getPost(ID){
        try{
            return await this.databases.getDocument(
                conf.databaseId,
                conf.postTableId,
                ID
            );
        }
        catch (error){
            console.log(error);
        }
    }

    async findUser(userId){
        try{
            return await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.userTableId,
                queries: [
                    Query.equal("userId", [String(userId)])
                ]
            });
        }
        catch (error){
            console.log(error);
        }
    }

    async listItems(queries = [Query.limit(10), Query.orderAsc('$createdAt')]){
        try{
            return await this.databases.listDocuments(
                conf.databaseId,
                conf.postTableId,
                queries
            );
        }
        catch (error){
            console.log(error);
        }
    }
};

const blogpost = new blogPost();

export default blogpost;
