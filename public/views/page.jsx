import React from 'react';

let Page = React.createClass({
  render:function(){
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          {this.props.children}
        </body>
        <script src='/bundle.js'></script>
      </html>
    )
  }
});

module.exports = Page;
