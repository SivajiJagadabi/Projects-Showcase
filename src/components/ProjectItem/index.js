import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="project-item ">
      <img src={imageUrl} alt={name} className="image" />
      <p>{name}</p>
    </li>
  )
}

export default ProjectItem
