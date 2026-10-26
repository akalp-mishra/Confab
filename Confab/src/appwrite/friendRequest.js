import conf from "../conf.js";
import { Client, ID,Databases, Query, TablesDB} from "appwrite";

class friendRequest{
    Client = new Client();
    tables;
    databases;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.tables = new TablesDB(this.Client);
        this.databases = new Databases(this.Client);
    }

    async findAccount(accountId){
        try{
            const result = await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.userTableId,
                queries: [
                    Query.equal('userId', accountId)
                ]
            })
            return result.rows[0] || null;
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    async sendFriendRequest(senderId, receiverId){
        try{
            return await this.tables.createRow({
                databaseId: conf.databaseId,
                tableId: conf.friendRequestTableId,
                rowId: ID.unique(),
                data: {
                    SenderId: senderId,
                    ReceiverId: receiverId,
                }
            })
        }
        catch(error){
            console.log(error);
        }
    }

    async checkFriendRequest(senderId, receiverId){
        try{
            let Queries;
            if(senderId){
                Queries = [
                    Query.equal('SenderId', senderId),
                    Query.equal('ReceiverId', receiverId)
                ]
            }
            else {
                Queries = [
                    Query.equal('ReceiverId', receiverId)
                ]
            }
            return await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.friendRequestTableId,
                queries: Queries
            })
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    async deleteFriendRequest(rowId){
        try{
            return await this.tables.deleteRow({
                databaseId: conf.databaseId,
                tableId: conf.friendRequestTableId,
                rowId: rowId
            })
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    async acceptFriendRequest(senderId, receiverId, rowId){
        try{
            const tx = await this.tables.createTransaction();

            await this.tables.createRow({
                databaseId: conf.databaseId,
                tableId: conf.friendTableId,
                rowId: ID.unique(),
                data: {
                    friend1Id: senderId,
                    friend2Id: receiverId
                },
                transactionId: tx.$id
            })

            await this.tables.deleteRow({
                databaseId: conf.databaseId,
                tableId: conf.friendRequestTableId,
                rowId: rowId,
                transactionId: tx.$id
            });

            return await this.tables.updateTransaction({
                transactionId: tx.$id,
                commit: true
            })

        }
        catch (error){
            console.log(error);
            throw error;
        }
    }

    async checkFriendship(userId){
        try{
            return await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.friendTableId,
                queries: [
                    Query.or([
                        Query.equal('friend1Id', userId),
                        Query.equal('friend2Id', userId)
                    ])
                ]
            })
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
}

const FriendRequest = new friendRequest();
export default FriendRequest;