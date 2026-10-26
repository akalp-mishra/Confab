import conf from "../conf.js";
import { Client, ID,Databases, Query, TablesDB} from "appwrite";

class likes{
    Client = new Client();
    tables;
    databases;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.tables = new TablesDB(this.Client);
        this.databases = new Databases(this.Client);
    }

    async  checkUserLiked(postId, userId){
        try{
            const result = await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.likeTableId,
                queries: [
                    Query.equal('postId', postId),
                    Query.equal('userId', userId)]
            })
            if(result.total >0) return true;
            else return false;
        }
        catch(error){
            if(error.code === 404) return false;
            throw error;
        }
    }

    async addLike(postId, userId){
        try{
            const tx = await this.tables.createTransaction();

            await this.databases.incrementDocumentAttribute({
                databaseId: conf.databaseId,
                collectionId: conf.postTableId,
                documentId: postId,
                attribute: 'likes',
                value: 1,
                transactionId: tx.$id
            });

            await this.tables.createRow({
                databaseId: conf.databaseId,
                tableId: conf.likeTableId,
                rowId: ID.unique(),
                data:{
                    userId: userId,
                    postId: postId
                },
                transactionId: tx.$id
            })

            return await this.tables.updateTransaction({
                transactionId: tx.$id,
                commit: true
            })
        }

        catch(error){
            console.log(error);
            throw error;
        }
    }

    async removeLike(postId,userId){
        try{
            const tx = await this.tables.createTransaction();

            const rowId = await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.likeTableId,
                queries: [
                    Query.equal('postId', postId),
                    Query.equal('userId', userId)
                ]
            })

            rowId.rows.forEach(async (row)=>{
                await this.tables.deleteRow({
                    databaseId: conf.databaseId,
                    tableId: conf.likeTableId,
                    rowId: row.$id,
                    transactionId: tx.$id
                })
            })

            await this.databases.decrementDocumentAttribute({
                databaseId: conf.databaseId,
                collectionId: conf.postTableId,
                documentId: postId,
                attribute: 'likes',
                value:1,
                min:0,
                transactionId: tx.$id
            })

            return await this.tables.updateTransaction({
                transactionId: tx.$id,
                commit: true
            })

        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

}

const Likes = new likes();
export default Likes;