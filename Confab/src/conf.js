const conf = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  projectName: import.meta.env.VITE_APPWRITE_PROJECT_NAME,
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  postTableId: import.meta.env.VITE_APPWRITE_POSTTABLE_ID,
  userTableId: import.meta.env.VITE_APPWRITE_USERTABLE_ID,
  likeTableId: import.meta.env.VITE_APPWRITE_LIKEDTABLE_ID,
  friendTableId: import.meta.env.VITE_APPWRITE_FRIENDSTABLE_ID,
  friendRequestTableId: import.meta.env.VITE_APPWRITE_FRIENDREQUESTTABLE_ID,
  projectsTableId: import.meta.env.VITE_APPWRITE_PROJECTSTABLE_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  tinymceapi: import.meta.env.VITE_TINYMCE_API_KEY
};

export default conf;