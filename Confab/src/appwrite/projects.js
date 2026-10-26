import conf from "../conf.js";
import { Client, ID, Query, TablesDB} from "appwrite";

class projects{
    Client = new Client();
    tables;

    constructor(){
        this.Client.setEndpoint(conf.endpoint).setProject(conf.projectId);
        this.tables = new TablesDB(this.Client);
    }

    async addProject({userId, projectName, ElevatorPitch, GithubLink="", DeploymentLink="", Media=""}){
        try{
            return await this.tables.createRow({
                databaseId: conf.databaseId,
                tableId: conf.projectsTableId,
                rowId: ID.unique(),
                data: {
                    ProjectName: projectName,
                    ElevatorPitch: ElevatorPitch,
                    GithubLink: GithubLink || null,
                    DeploymentLink: DeploymentLink || null,
                    Media,
                    likes: 0,
                    userId: userId
                }
            })
        }
        catch(error){
            console.error('Failed to create project row.', error);
            throw error;
        }
    }

    async updateProject(rowId, {userId, projectName, ElevatorPitch, GithubLink="", DeploymentLink="", Media=""}){
        try{
            return await this.tables.updateRow({
                databaseId: conf.databaseId,
                tableId: conf.projectsTableId,
                rowId,
                data: {
                    ProjectName: projectName,
                    ElevatorPitch: ElevatorPitch,
                    GithubLink: GithubLink || null,
                    DeploymentLink: DeploymentLink || null,
                    Media,
                    userId: userId
                }
            })
        }
        catch(error){
            console.error('Failed to update project row.', error);
            throw error;
        }
    }

    async deleteProject(rowId){
        try{
            return await this.tables.deleteRow({
                databaseId: conf.databaseId,
                tableId: conf.projectsTableId,
                rowId,
            })
        }
        catch(error){
            console.error('Failed to delete project row.', error);
            throw error;
        }
    }

    async getProject(rowId){
        try{
            return await this.tables.getRow({
                databaseId: conf.databaseId,
                tableId: conf.projectsTableId,
                rowId,
            })
        }
        catch(error){
            console.error('Failed to get project row.', error);
            throw error;
        }
    }

    async listProjects(){
        try{
            return await this.tables.listRows({
                databaseId: conf.databaseId,
                tableId: conf.projectsTableId,
                queries: [
                    Query.orderDesc('$createdAt'),
                    Query.limit(50)
                ]
            })
        }
        catch(error){
            console.error('Failed to list projects.', error);
            throw error;
        }
    }

}

const Projects = new projects();
export default Projects;