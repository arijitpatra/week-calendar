import React, { Component } from "react";
import "./calendar.scss";
import moment from "moment";

class Calendar extends Component {
  weekdaysShort = moment.weekdaysShort();

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentData: [],
      currentWeekNumber: 2,
      timeSlot: ["10am", "11am", "12noon"]
    };
  }

  componentDidMount() {
    fetch("./data.json")
      .then(res => res.json())
      .then(data => {
        this.setState({ data: data.data });
        this.setState({
          currentData: data.data.filter(
            x => x.weekNumber === this.state.currentWeekNumber
          )
        });
      });
  }

  getPreviousWeek = () => {
    this.setState({
      currentData: this.state.data.filter(
        x => x.weekNumber === this.state.currentWeekNumber - 1
      )
    });
    this.setState({
      currentWeekNumber: this.state.currentWeekNumber - 1
    });
  };

  getNextWeek = () => {
    this.setState({
      currentData: this.state.data.filter(
        x => x.weekNumber === this.state.currentWeekNumber + 1
      )
    });
    this.setState({
      currentWeekNumber: this.state.currentWeekNumber + 1
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="l-flex-1">
          <div className="l-flex-1">
            <i
              className="fa fa-fw fa-chevron-left"
              onClick={this.getPreviousWeek}
            />
          </div>
          {this.weekdaysShort.map(x => (
            <div className="l-flex-1" key={x}>
              {x}
            </div>
          ))}
          <div className="l-flex-1">
            <i
              className="fa fa-fw fa-chevron-right"
              onClick={this.getNextWeek}
            />
          </div>
        </div>

        <div className="l-flex-1">
          <div className="l-flex-1">
            <i className="invisible fa fa-fw fa-chevron-left" />
          </div>
          {this.state.currentData.map(x => (
            <div className="l-flex-1" key={x.id}>
              {x.date}
            </div>
          ))}
          <div className="l-flex-1">
            <i className="invisible fa fa-fw fa-chevron-right" />
          </div>
        </div>

        <div className="">
          {this.state.timeSlot.map(c => (
            <div key={c} id={c}>
              {c}
              <div className="l-flex-1">
                <div className="l-flex-1">
                  <i className="invisible fa fa-fw fa-chevron-left" />
                </div>
                {this.state.currentData.map(x => (
                  <div
                    id={x.date + "-" + c}
                    className={
                      "l-flex-1 " +
                      (x.content === "" ? "l-box-empty" : "l-box-filled")
                    }
                    key={x.id}
                  >
                    {x.content.length === 0 ? "" : x.content[c]}
                  </div>
                ))}
                <div className="l-flex-1">
                  <i className="invisible fa fa-fw fa-chevron-right" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Calendar;
