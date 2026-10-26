import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Projects from '../../appwrite/projects'
import fileupload from '../../appwrite/fileUpload'
import Button from '../Button'
import Input from '../Input'

const MAX_MEDIA_SIZE = 50 * 1024 * 1024

function isValidUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function ProjectForm({ project = null }) {
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userdata)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      projectName: project?.ProjectName || '',
      ElevatorPitch: project?.ElevatorPitch || '',
      GithubLink: project?.GithubLink || '',
      DeploymentLink: project?.DeploymentLink || ''
    }
  })
  const githubLink = watch('GithubLink')
  const deploymentLink = watch('DeploymentLink')

  async function submit(values) {
    setSubmitError('')
    setIsSubmitting(true)
    let uploadedMediaId = null

    try {
      const mediaFile = values.Media?.[0]
      if (mediaFile) {
        uploadedMediaId = await fileupload.uploadFile(mediaFile)
        if (!uploadedMediaId) throw new Error('Media upload did not return a file ID.')
      }

      const mediaId = uploadedMediaId || project?.Media || ''
      const projectData = {
        userId: userData.$id,
        projectName: values.projectName.trim(),
        ElevatorPitch: values.ElevatorPitch.trim(),
        GithubLink: values.GithubLink.trim(),
        DeploymentLink: values.DeploymentLink.trim(),
        Media: mediaId || null
      }
      const savedProject = project
        ? await Projects.updateProject(project.$id, projectData)
        : await Projects.addProject(projectData)

      if (!savedProject) throw new Error('Project row was not saved.')

      if (uploadedMediaId && project?.Media && project.Media !== uploadedMediaId) {
        try {
          await fileupload.deleteFile(project.Media)
        } catch (cleanupError) {
          console.error('Project was saved, but the previous media could not be deleted.', cleanupError)
        }
      }
      navigate('/')
    } catch (error) {
      console.error('Failed to save project.', error)
      if (uploadedMediaId) {
        try {
          await fileupload.deleteFile(uploadedMediaId)
        } catch (cleanupError) {
          console.error('Failed to clean up uploaded project media after a save failure.', cleanupError)
        }
      }
      setSubmitError('Could not save the project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const linkRules = (otherLink) => ({
    validate: {
      validUrl: (value) => isValidUrl(value) || 'Enter a valid HTTP or HTTPS URL.',
      atLeastOneLink: (value) => Boolean(value || otherLink) || 'Add a GitHub or deployment URL.'
    }
  })

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto w-full max-w-3xl space-y-5 rounded-xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold">{project ? 'Edit project' : 'Create project'}</h1>
      <Input
        label="Project name"
        className="mb-2"
        {...register('projectName', { required: 'Enter a project name.' })}
      />
      {errors.projectName && <p className="text-sm text-red-600">{errors.projectName.message}</p>}

      <div className="flex flex-col">
        <label className="mb-2" htmlFor="project-pitch">Elevator pitch</label>
        <textarea
          id="project-pitch"
          rows={5}
          className="rounded-lg bg-gray-200 p-3"
          {...register('ElevatorPitch', { required: 'Enter a short project description.' })}
        />
        {errors.ElevatorPitch && <p className="mt-1 text-sm text-red-600">{errors.ElevatorPitch.message}</p>}
      </div>

      <div>
        <Input
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/..."
          className="mb-2"
          {...register('GithubLink', linkRules(deploymentLink))}
        />
        {errors.GithubLink && <p className="mb-2 text-sm text-red-600">{errors.GithubLink.message}</p>}
        <Input
          label="Deployment URL"
          type="url"
          placeholder="https://..."
          className="mb-2"
          {...register('DeploymentLink', linkRules(githubLink))}
        />
        {errors.DeploymentLink && <p className="text-sm text-red-600">{errors.DeploymentLink.message}</p>}
        <p className="mt-1 text-sm text-gray-600">At least one GitHub or deployment URL is required.</p>
      </div>

      <div>
        <Input
          label="Project media (optional, image or video under 50 MB)"
          type="file"
          accept="image/*,video/*"
          className="mb-2"
          {...register('Media', {
            validate: {
              supportedType: (files) => !files?.[0] || /^(image|video)\//.test(files[0].type) || 'Select an image or video.',
              maxSize: (files) => !files?.[0] || files[0].size < MAX_MEDIA_SIZE || 'Media must be smaller than 50 MB.'
            }
          })}
        />
        {project?.Media && (
          <a
            className="text-sm text-blue-700 underline"
            href={fileupload.getFileView(project.Media)}
            target="_blank"
            rel="noreferrer"
          >
            View current project media
          </a>
        )}
        {errors.Media && <p className="mt-1 text-sm text-red-600">{errors.Media.message}</p>}
      </div>

      {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
      <Button type="submit" disabled={isSubmitting} className="rounded-lg bg-green-500 px-5 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Saving...' : project ? 'Update project' : 'Create project'}
      </Button>
    </form>
  )
}

export default ProjectForm
