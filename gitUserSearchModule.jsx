const styles = {
  profileImage: {
    borderRadius: '5px'
  },
  userBadge: {
    textAlign: 'center',
    borderRadius: '5px'
  },
  userName: {
    display: 'inline'
  },
  errorMessage: {
    color: 'red'
  },
  navBar: {
    borderTop: '0px',
    borderBottom: '0px'
  },
  navBarInverse: {
    marginBottom: '0px'
  },
  cardText: {
    color: '#586069',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  repoHeader: {
    padding: '20px'
  },
  thumbnail: {
    height: '300px'
  },
  follows: {
    padding: '10px'
  }
};


const UserBadge = props =>
  <div className="jumbotron" style={styles.userBadge}> 
    <img src={props.userInfo.avatar_url} style={styles.profileImage} height='100px' width='100px' />
    <p style={styles.userName}> {props.userInfo.name} </p>
    <br /> 
    <p style={styles.follows}> 
      Followers: <span className="badge"> {props.userInfo.followers} </span>
      {'\u00A0'}
      Following: <span className="badge"> {props.userInfo.following} </span>
    </p>
  </div>
  
const RepoList = props =>
  <div className="col">
    <div className="col-sm-4">
      <div className="thumbnail" style={styles.thumbnail}>
        <h4><p style={styles.cardText}> {props.name} </p></h4>
        <p style={styles.cardText}><a href='#'>{props.git_url} </a></p>
        <div>
          <p> Stars: <span className="badge"> {props.stargazers_count} </span></p>
          <p> Forks: <span className="badge"> {props.forks} </span> </p>
          <p> Size: <span className="badge"> {props.size} </span> </p>
          <p> Open Issues: <span className="badge"> {props.open_issues} </span></p>
          <h5><p style={styles.cardText}> {props.description} </p></h5>
        </div>
      </div>
    </div>
  </div>

class Search extends React.Component {
	constructor(props) {
    super(props)
    this.state = {  
      userInfo: null,
      repos: null,
      value: '',
      error: null,
      errorMessage: null
    }
  }

  searchGit = (event) => {
  	event.preventDefault(); // stop event to prevent page reload.
  	let username = this.state.value;
    const handleErrors = (response) => {
      if (!response.ok) {
        this.setState({error: true, errorMessage: response.statusText})
        throw Error(response.statusText);
      }
      return response;
		}
    
    fetch('https://api.github.com/users/' + username)
      .then(handleErrors)
      .then(response => response.json())
      .then(body => this.setState({userInfo: body, error: false}))
    
    fetch('https://api.github.com/users/' + username + '/repos')
      .then(handleErrors)
      .then(response => response.json())
      .then(body => this.setState({repos: body, error: false}))
	}
  
  renderRepoList = () => {
    const listOfRepos = this.state.repos.map((repo, index) => <RepoList 
      name={repo.name}
      git_url={repo.git_url}
      stargazers_count={repo.stargazers_count}
      forks={repo.forks}
      size={repo.size}
      open_issues={repo.open_issues}
      description={repo.description}
      key={index} />
    );
    return listOfRepos;
  }
  
  handleChange = (event) => {
  	this.setState({value: event.target.value});
  }
  
  render() {
    return (
      <div>
        <div className="navbar navbar-inverse" style={styles.navBarInverse}>
          <a href="#" className="navbar-brand">
            <img src="http://abb1991.github.io/images/thumbnails/github-logo.svg" height='25px' width='25px' />
          </a>
          <form  style={styles.navBar} className="navbar-form navbar-left" role="search" onSubmit={this.searchGit}> 
            <div className="form-group">
               <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Search" />
            </div>
            <button type="submit" className="btn btn-default">Search</button>
          </form>
        </div>
        {this.state.userInfo && !this.state.error ? <UserBadge userInfo = {this.state.userInfo} /> : undefined}
        {this.state.error ? <div style={styles.errorMessage}>{this.state.errorMessage}</div> : undefined}
        {this.state.repos && !this.state.error ? <div className='row'><h3 style={styles.repoHeader}>Repos:</h3>{this.renderRepoList()}</div> : undefined}
      </div>
    );
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('container')
);