import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectList: [],
    activeOptionId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectData()
  }

  getProjectData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const responsive = await fetch(apiUrl, options)
    if (responsive.ok) {
      const data = await responsive.json()
      console.log(data)
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectData)
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.getProjectData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectList} = this.state
    return (
      <ul className="project-list-container">
        {projectList.map(eachItem => (
          <ProjectItem key={eachItem.id} projectDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderProjectList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId, projectList} = this.state
    return (
      <>
        <Header />
        <div className="select-container">
          <select
            className="select-input"
            onChange={this.onChangeOption}
            value={activeOptionId}
          >
            {categoriesList.map(eachOption => (
              <option key={eachOption.id} value={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjectList()}
      </>
    )
  }
}

export default Home
