import React from 'react';
import Page from './page.jsx';

let Index = React.createClass({
  render:function(){
  let { title, tags } = this.props;
  let tagList = tags.map((tag) => <li>{ tag }</li>);

    return (
      <Page {...this.props}>
        <h1>{ title }</h1>
        <ul>
        { tagList }
        </ul>
      </Page>
    )
  }
});

module.exports = Index;
