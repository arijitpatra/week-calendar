import React, { Component } from "react";
import "./calendar.scss";
import moment from "moment";
import Loader from "../loader/loader";

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
  }

  deleteEvent(time, date, weekNumber) {
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
  }

  render() {
    if (this.state.isLoading === false) {
      return (
        <React.Fragment>
          {/* 1 - This will be the component for weeks and previous, next week navigation buttons */}
          <div className="l-flex-1 mt-4">
            <div className="l-flex-1">
              <i
                className={
                  "fa fa-fw fa-chevron-left g-cursor-pointer g-fs-32 " +
                  (this.state.currentWeekNumber === 1 ? "invisible" : "")
                }
                onClick={this.getPreviousWeek}
              />
            </div>
            {this.weekdaysShort.map(day => (
              <div className="l-flex-1" key={day}>
                <b>{day}</b>
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
          {/* 1 - Ends Here */}

          {/* 2 - This will be the component for displaying the dates below the week days */}
          <div className="l-flex-1">
            <div className="l-flex-1">
              <i className="invisible fa fa-fw fa-chevron-left" />
            </div>
            {this.state.currentData.map(dataItem => (
              <div className="l-flex-1 g-fs-32" key={dataItem.id}>
                {dataItem.date}
              </div>
            ))}
            <div className="l-flex-1">
              <i className="invisible fa fa-fw fa-chevron-right" />
            </div>
          </div>
          {/* 2 - Ends Here */}

          {/* 3 - This will be the component that takes care of the grid of days/dates and timeslots along with the modal */}
          <div className="p-4">
            {this.state.timeSlot.map(timeItem => (
              <div key={timeItem} id={timeItem}>
                <div className="l-flex-1 l-row-align">
                  <div className="l-time-align">{timeItem}</div>
                  {this.state.currentData.map(dataItem => (
                    <React.Fragment
                      key={dataItem.date + "-" + timeItem + "-fragment"}
                    >
                      <div
                        id={dataItem.date + "-" + timeItem}
                        className={
                          "l-flex-1 " +
                          (dataItem.content[timeItem] === undefined
                            ? "l-box-empty"
                            : "l-box-filled")
                        }
                        key={dataItem.date + "-" + timeItem}
                        data-toggle="modal"
                        data-target={
                          "#" + dataItem.date + "-" + timeItem + "-modal"
                        }
                      >
                        {dataItem.content.length === 0
                          ? ""
                          : dataItem.content[timeItem]}
                      </div>
                      <div
                        className="modal"
                        id={dataItem.date + "-" + timeItem + "-modal"}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                Modify Event -{" "}
                                {this.currentMonth +
                                  " " +
                                  dataItem.date +
                                  ", " +
                                  this.currentYear +
                                  " - " +
                                  timeItem}{" "}
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
                                  dataItem.content.length === 0
                                    ? ""
                                    : dataItem.content[timeItem]
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
                                      timeItem,
                                      dataItem.date,
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
                                      timeItem,
                                      dataItem.date,
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
          {/* 3 - Ends Here */}
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  }
}

export default Calendar;
