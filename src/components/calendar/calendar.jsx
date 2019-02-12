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
      timeSlot: [
        "9am",
        "10am",
        "11am",
        "12noon",
        "1pm",
        "2pm",
        "3pm",
        "4pm",
        "5pm"
      ]
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

  editEvent(event, time, date, weekNumber) {
    console.log(event.target.value, time, date, weekNumber);
    let modifiedData = this.state.data
      .filter(x => x.weekNumber === weekNumber)
      .filter(y => y.date === date);
    // // modifiedData.forEach(z => {
    // //   if (z.content.hasOwnProperty(time)) {
    // //     return (z.content[time] = event.target.value);
    // //   } else {
    // //     console.log(false);
    // //   }
    // // });
    // modifiedData.content[time] = "hello";
    modifiedData.content = {
      [date + "-" + time]: event.target.value
    };
    console.log(modifiedData);
    // this.setState({ currentData: modifiedData });
  }

  render() {
    return (
      <React.Fragment>
        <div className="l-flex-1 mt-5">
          <div className="l-flex-1">
            <i
              className={
                "fa fa-fw fa-chevron-left g-cursor-pointer " +
                (this.state.currentWeekNumber === 1 ? "invisible" : "")
              }
              onClick={this.getPreviousWeek}
            />
          </div>
          {this.weekdaysShort.map(x => (
            <div className="l-flex-1" key={x}>
              <b>{x}</b>
            </div>
          ))}
          <div className="l-flex-1">
            <i
              className={
                "fa fa-fw fa-chevron-right g-cursor-pointer " +
                (this.state.currentWeekNumber === 3 ? "invisible" : "")
              }
              onClick={this.getNextWeek}
            />
          </div>
        </div>

        <div className="l-flex-1">
          <div className="l-flex-1">
            <i className="invisible fa fa-fw fa-chevron-left" />
          </div>
          {this.state.currentData.map(x => (
            <div className="l-flex-1 g-fs-32" key={x.id}>
              {x.date}
            </div>
          ))}
          <div className="l-flex-1">
            <i className="invisible fa fa-fw fa-chevron-right" />
          </div>
        </div>

        <div className="p-4">
          {this.state.timeSlot.map(c => (
            <div key={c} id={c}>
              <div className="l-flex-1 l-row-align">
                <div className="l-time-align">{c}</div>
                {this.state.currentData.map(x => (
                  <React.Fragment key={x.date + "-" + c + "-fragment"}>
                    <div
                      id={x.date + "-" + c}
                      className={
                        "l-flex-1 " +
                        (x.content[c] === undefined
                          ? "l-box-empty"
                          : "l-box-filled")
                      }
                      key={x.date + "-" + c}
                      data-toggle="modal"
                      data-target={"#" + x.date + "-" + c + "-modal"}
                    >
                      {x.content.length === 0 ? "" : x.content[c]}
                    </div>
                    <div className="modal" id={x.date + "-" + c + "-modal"}>
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title">Modify Event</h4>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>

                          <div className="modal-body">
                            <input
                              type="text"
                              defaultValue={
                                x.content.length === 0 ? "" : x.content[c]
                              }
                              onChange={e =>
                                this.editEvent(
                                  e,
                                  c,
                                  x.date,
                                  this.state.currentWeekNumber
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Calendar;
