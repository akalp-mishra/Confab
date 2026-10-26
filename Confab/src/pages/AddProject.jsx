import Header from '../components/Header'
import Container from '../components/Container/Container'
import Protected from '../components/AuthLayout'
import ProjectForm from '../components/project-form/ProjectForm'

function AddProject() {
  return (
    <Protected authentication={true}>
      <Header />
      <main className="min-h-screen bg-gray-100 py-8">
        <Container>
          <ProjectForm />
        </Container>
      </main>
    </Protected>
  )
}

export default AddProject
