import React from 'react';
import PropTypes from 'prop-types';
import * as vega from 'vega';
import './index.css';
import SplitPane from 'react-split-pane';
import Error from '../error';
import ErrorPane from '../error-pane';
import Toolbar from '../toolbar';

export default class Editor extends React.Component {
  static propTypes = {
    vegaSpec: PropTypes.object
  }

  renderVega (props) {
    this.refs.chart.style.width = this.refs.chart.getBoundingClientRect().width + 'px';
    const runtime = vega.parse(props.vegaSpec);
    const view = new vega.View(runtime)
      .logLevel(vega.Warn)
      .initialize(this.refs.chart)
      .renderer(props.renderer)
      .hover()
      .run();

    this.refs.chart.style.width = 'auto';
    window.VEGA_DEBUG.view = view;
  }

  componentDidMount () {
    this.renderVega(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.renderVega(nextProps);
  }

  getChart() {
    return (
      <div className='chart-container'>
        <Error />
        <div className='chart'>
          <div ref='chart'>
          </div>
        </div>
        <Toolbar />
      </div>
    );
  }

  render () {
    if ((this.props.error != null || this.props.warningsLogger.warns.length > 0) && this.props.errorPane) {
      return (
        <SplitPane split='horizontal' defaultSize={window.innerWidth * 0.4}>
          {this.getChart()}
          <ErrorPane />
        </SplitPane>
      );
    } else {
      return this.getChart();
    }
  };
}
