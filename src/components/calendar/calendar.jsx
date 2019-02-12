import React, { Component } from "react";
import "./calendar.scss";
import moment from "moment";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.weekdaysShort = moment.weekdaysShort();
    const monthsArray = [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    this.currentMonth = monthsArray[moment().month()];
    this.currentYear = moment().year();
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
      ],
      eventInput: "",
      isLoading: true
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
      })
      .then(() => this.setState({ isLoading: false }));
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

  editEvent(event) {
    this.setState({ eventInput: event.target.value });
  }

  saveEvent(time, date, weekNumber) {
    console.log(time, date, weekNumber);
    const matchedObject = this.state.data
      .filter(x => x.weekNumber === weekNumber)
      .filter(y => y.date === date)[0];

    const matchedObjectId = matchedObject.id;
    const objectIndex = this.state.data.findIndex(
      x => x.id === matchedObjectId
    );

    let dataCopy = Object.assign(this.state.data);
    dataCopy[objectIndex].content = {
      ...dataCopy[objectIndex].content,
      [time]: this.state.eventInput
    };
    const contentTimeSlots = Object.getOwnPropertyNames(
      dataCopy[objectIndex].content
    );
    contentTimeSlots.forEach(x => {
      if (dataCopy[objectIndex].content[x] === "") {
        delete dataCopy[objectIndex].content[x];
      }
    });

    this.setState({ data: dataCopy });
    console.log(dataCopy);
  }

  deleteEvent(time, date, weekNumber) {
    console.log(time, date, weekNumber);
    const matchedObject = this.state.data
      .filter(x => x.weekNumber === weekNumber)
      .filter(y => y.date === date)[0];

    const matchedObjectId = matchedObject.id;
    const objectIndex = this.state.data.findIndex(
      x => x.id === matchedObjectId
    );

    let dataCopy = Object.assign(this.state.data);
    dataCopy[objectIndex].content = {
      ...dataCopy[objectIndex].content,
      [time]: ""
    };
    const contentTimeSlots = Object.getOwnPropertyNames(
      dataCopy[objectIndex].content
    );
    contentTimeSlots.forEach(x => {
      if (dataCopy[objectIndex].content[x] === "") {
        delete dataCopy[objectIndex].content[x];
      }
    });

    this.setState({ data: dataCopy });
    console.log(dataCopy);
  }

  render() {
    if (this.state.isLoading === false) {
      return (
        <React.Fragment>
          <div className="l-flex-1 mt-5">
            <div className="l-flex-1">
              <i
                className={
                  "fa fa-fw fa-chevron-left g-cursor-pointer g-fs-32 " +
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
                  "fa fa-fw fa-chevron-right g-cursor-pointer g-fs-32 " +
                  (this.state.currentWeekNumber === 4 ? "invisible" : "")
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
                              <h5 className="modal-title">
                                Modify Event -{" "}
                                {this.currentMonth +
                                  " " +
                                  x.date +
                                  ", " +
                                  this.currentYear +
                                  " - " +
                                  c}{" "}
                              </h5>
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
                                className="w-100 p-2"
                                type="text"
                                defaultValue={
                                  x.content.length === 0 ? "" : x.content[c]
                                }
                                onChange={e => this.editEvent(e)}
                              />
                              <div className="mt-3 mb-3">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm float-left"
                                  data-dismiss="modal"
                                  onClick={() =>
                                    this.saveEvent(
                                      c,
                                      x.date,
                                      this.state.currentWeekNumber
                                    )
                                  }
                                >
                                  Add / Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm float-right"
                                  data-dismiss="modal"
                                  onClick={() =>
                                    this.deleteEvent(
                                      c,
                                      x.date,
                                      this.state.currentWeekNumber
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
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
    } else {
      return (
        <div className="row p-0 m-0 justify-content-center align-items-center l-loader">
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
  }
}

export default Calendar;
