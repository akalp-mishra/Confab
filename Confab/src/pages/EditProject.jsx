import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Projects from '../appwrite/projects'
import Container from '../components/Container/Container'
import Header from '../components/Header'
import Protected from '../components/AuthLayout'
import ProjectForm from '../components/project-form/ProjectForm'

function EditProject() {
  const [project, setProject] = useState(null)
  const [loadError, setLoadError] = useState('')
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let isCurrent = true

    async function loadProject() {
      if (!slug) {
        navigate('/')
        return
      }
      try {
        const result = await Projects.getProject(slug)
        if (!result) throw new Error('Project was not found.')
        if (isCurrent) setProject(result)
      } catch (error) {
        console.error('Failed to load project for editing.', error)
        if (isCurrent) setLoadError('Could not load this project.')
      }
    }

    loadProject()
    return () => {
      isCurrent = false
    }
  }, [slug, navigate])

  return (
    <Protected authentication={true}>
      <Header />
      <main className="min-h-screen bg-gray-100 py-8">
        <Container>
          {project && <ProjectForm project={project} />}
          {loadError && <p role="alert" className="rounded-lg bg-white p-5 text-red-700">{loadError}</p>}
          {!project && !loadError && <p role="status">Loading project...</p>}
        </Container>
      </main>
    </Protected>
  )
}

export default EditProject
