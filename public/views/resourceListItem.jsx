import React from 'react';

class ResourceListItem extends React.Component {

  render(){
    let { url, tags } = this.props;
    let tagList = tags.map((tag, index) => <span key={index}>[ {tag} ]</span>);
    return (
      <li>
        <a href={ url }>{ url }</a> - { tagList }
      </li>
    );
  }
};

module.exports = ResourceListItem;
