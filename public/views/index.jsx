import React from 'react';
import axios from 'axios';
import Page from './page.jsx';
import ResourceListItem from './resourceListItem.jsx';

var ws;
if(global.WebSocket){ ws = new WebSocket('ws:/localhost:4000') || null };

class Index extends React.Component {
  constructor(props){
    super(props);
    let { resources } = this.props;
    this.state = { resources };
  }

  componentDidMount(){
    let { resources } = this.state;
    ws.onmessage = ({data}) => {
      let resource = JSON.parse(data);
      resources.push(resource);
      this.setState({ resources: resources });
    };
  }

  handleSubmit(e){
    e.preventDefault();
    let url = React.findDOMNode(this.refs.url).value.trim();
    let tags = React.findDOMNode(this.refs.tags).value.trim();
    axios.put('/new', {url, tags})
      .catch((response) => console.log(response))
  }

  render() {
    let { title } = this.props;
    let { resources } = this.state;
    let resourceList = resources.map(({url, tags}) =>
      <ResourceListItem key={ url } url={ url } tags={ tags }/>);


    return (
      <Page {...this.props}>
        <h1>{ title }</h1>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <input type="text" ref="url"/>
          <input type="text" ref="tags"/>
          <input type="submit"/>
        </form>
        <ul>
          { resourceList }
        </ul>
      </Page>
    )
  }
};

module.exports = Index;
