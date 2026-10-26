import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThumbsUp, UserCircle } from 'lucide-react'
import fileupload from '../appwrite/fileUpload'
import Projects from '../appwrite/projects'
import Likes from '../appwrite/likes'
import blogpost from '../appwrite/post'

function ProjectCard({ project, currentUser }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes || 0)
  const [isUpdatingLike, setIsUpdatingLike] = useState(false)
  const [likeError, setLikeError] = useState('')
  const isAuthenticated = Boolean(currentUser?.$id)
  const navigate = useNavigate()

  useEffect(() => {
    setLikeCount(project.likes || 0)
  }, [project.likes])

  useEffect(() => {
    let isCurrent = true
    if (isAuthenticated) {
      Likes.checkUserLiked(null, project.$id, currentUser.$id)
        .then((liked) => {
          if (isCurrent) setIsLiked(liked)
        })
        .catch((error) => {
          console.error(`Failed to check like for project ${project.$id}.`, error)
          if (isCurrent) setLikeError('Could not load like status.')
        })
    } else {
      setIsLiked(false)
    }
    return () => {
      isCurrent = false
    }
  }, [currentUser?.$id, isAuthenticated, project.$id])

  async function toggleLike() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (isUpdatingLike) return

    setIsUpdatingLike(true)
    setLikeError('')
    try {
      if (isLiked) {
        await Likes.removeProjectLike(project.$id, currentUser.$id, likeCount)
        setLikeCount((count) => Math.max(0, count - 1))
        setIsLiked(false)
      } else {
        await Likes.addProjectLike(project.$id, currentUser.$id, likeCount)
        setLikeCount((count) => count + 1)
        setIsLiked(true)
      }
    } catch (error) {
      console.error(`Failed to update like for project ${project.$id}.`, error)
      setLikeError('Could not update your like. Please try again.')
    } finally {
      setIsUpdatingLike(false)
    }
  }

  return (
    <article className="h-full rounded-lg bg-white p-5 shadow-lg transition-colors duration-200 hover:bg-green-100">
      <div className="mb-4 flex items-center gap-3">
        {project.author?.profileImage
          ? <img src={fileupload.getFileView(project.author.profileImage)} alt={`${project.author.userName || 'User'}'s profile`} className="h-10 w-10 rounded-full object-cover" />
          : <UserCircle className="h-10 w-10 text-gray-500" aria-label="No profile picture" />}
        <span className="font-semibold">{project.author?.userName || 'Unknown author'}</span>
      </div>

      <h3 className="mb-2 text-xl font-bold">{project.ProjectName}</h3>
      <p className="mb-4 whitespace-pre-wrap text-gray-700">{project.ElevatorPitch}</p>

      {project.Media && (
        <a
          className="mb-4 inline-block text-blue-700 underline"
          href={fileupload.getFileView(project.Media)}
          target="_blank"
          rel="noreferrer"
        >
          View project media
        </a>
      )}

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
        {project.GithubLink && (
          <a className="text-blue-700 underline" href={project.GithubLink} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {project.DeploymentLink && (
          <a className="text-blue-700 underline" href={project.DeploymentLink} target="_blank" rel="noreferrer">
            Live project
          </a>
        )}
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLike}
            disabled={isUpdatingLike}
            aria-label={isLiked ? 'Unlike project' : 'Like project'}
            aria-pressed={isLiked}
            className="mt-3 rounded p-1 hover:bg-gray-100 disabled:cursor-wait"
          >
            <ThumbsUp className={isLiked ? 'fill-blue-600 text-blue-600' : ''} />
          </button>
          <span className="mt-3">{likeCount}</span>
        </div>
        {project.userId === currentUser?.$id && (
          <button
            type="button"
            onClick={() => navigate(`/edit-project/${project.$id}`)}
            className="mt-3 rounded px-3 py-1 text-sm text-blue-700 hover:bg-gray-100"
          >
            Edit project
          </button>
        )}
      </div>
      {likeError && <p role="alert" className="mt-2 text-sm text-red-700">{likeError}</p>}
    </article>
  )
}

function ProjectsCard() {
  const currentUser = useSelector((state) => state.auth.userdata)
  const [projects, setProjects] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadProjects() {
      try {
        const result = await Projects.listProjects()
        if (!result?.rows) throw new Error('Project list returned no rows.')

        const projectsWithAuthors = await Promise.all(result.rows.map(async (project) => {
          if (!project.userId) return { ...project, author: null }
          const authorResult = await blogpost.findUser(project.userId)
          return { ...project, author: authorResult?.rows?.[0] || null }
        }))

        if (isCurrent) setProjects(projectsWithAuthors)
      } catch (error) {
        console.error('Failed to load projects.', error)
        if (isCurrent) setLoadError('Could not load projects. Please try again later.')
      }
    }

    loadProjects()
    return () => {
      isCurrent = false
    }
  }, [])

  if (loadError) {
    return <p role="alert" className="col-span-full rounded-lg bg-white p-4 text-red-700">{loadError}</p>
  }

  return (
    <section className="col-span-full mt-4" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mb-4 text-2xl font-bold">Projects</h2>
      {projects === null
        ? <p role="status">Loading projects...</p>
        : projects.length === 0
          ? <p className="rounded-lg bg-white p-4 text-gray-600">No projects have been shared yet.</p>
          : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.$id} project={project} currentUser={currentUser} />
              ))}
            </div>}
    </section>
  )
}

export default ProjectsCard
