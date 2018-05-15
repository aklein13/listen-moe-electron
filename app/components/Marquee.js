import React, {Component} from 'react'

const tagStyle = {
  margin: '0 auto',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

class Marquee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10000,
      htmlTag: 'h3',
      color: 'black',
    };
  }

  componentWillMount() {
    const {color, size, time} = this.props;
    this.setState({
      crossTime: time || 10000,
      htmlTag: size || 'h3',
      color: color || 'black'
    });
  }

  render() {
    const {text} = this.props;
    const {
      crossTime,
      color,
    } = this.state;
    const textStyle = {
      display: 'inline-block',
      paddingLeft: '100%',
      animation: `marquee ${crossTime}ms linear infinite`,
      color,
    };

    return (
      <section id="marquee">
        <this.state.htmlTag style={tagStyle}>
          <span style={textStyle}>{text}</span>
        </this.state.htmlTag>
      </section>
    );
  }
}

export default Marquee;
