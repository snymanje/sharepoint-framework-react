import * as React from 'react';
import HighchartsReact from "highcharts-react-official";
// Import Highcharts
import * as Highcharts from "highcharts";
import highchartsGantt from "highcharts/modules/gantt";

highchartsGantt(Highcharts);

var today: Date = new Date(),
  day = 1000 * 60 * 60 * 24,
  // Utility functions
  dateFormat = Highcharts.dateFormat,
  defined = Highcharts.defined,
  // isObject = Highcharts.isObject,
  reduce = Highcharts.reduce;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
const newToday = today.getTime();

const options = {
  series: [
    {
      name: "Offices",
      data: [
        {
          name: "Jean Snyman",
          id: "new_offices",
          owner: "Jean Snyman",
        },
        {
          name: "Prepare office building",
          id: "prepare_building",
          parent: "new_offices",
          start: newToday - 2 * day,
          end: newToday + 30 * day,
          completed: {
            amount: 0.2,
          },
          owner: "Linda",
        },
        {
          name: "Inspect building",
          id: "inspect_building",
          parent: "new_offices",
          start: newToday + 20 * day,
          end: newToday + 45 * day,
          owner: "Ivy",
          completed: {
            amount: 0.2,
          },
        },
        {
          name: "Passed inspection",
          id: "passed_inspection",
          dependency: "inspect_building",
          parent: "new_offices",
          start: newToday + 28 * day,
          milestone: true,
          owner: "Peter",
        },
        {
          name: "Relocate",
          id: "relocate",
          owner: "Josh",
        },
        {
          name: "Relocate staff",
          id: "relocate_staff",
          parent: "relocate",
          start: newToday + 0 * day,
          end: newToday + 11 * day,
          owner: "Mark",
        },
        {
          name: "Relocate test facility",
          dependency: "relocate_staff",
          parent: "relocate",
          start: newToday + 11 * day,
          end: newToday + 13 * day,
          owner: "Anne",
        },
        {
          name: "Relocate cantina",
          dependency: "relocate_staff",
          parent: "relocate",
          start: newToday + 11 * day,
          end: newToday + 14 * day,
        },
      ],
    },
  ],
  tooltip: {
    pointFormatter: function () {
      var point = this,
        format = "%e. %b",
        options = point.options,
        //completed = options.completed,
        //amount = isObject(completed) ? completed.amount : completed,
        //status = (amount || 0) * 100 + "%",
        lines;

      lines = [
        {
          value: point.name,
          style: "font-weight: bold;",
        },
        {
          title: "Start",
          value: dateFormat(format, point.start),
        },
        {
          visible: !options.milestone,
          title: "End",
          value: dateFormat(format, point.end),
        },
        /*         {
          title: "Completed",
          value: status,
        }, */
        {
          title: "Owner",
          value: options.owner || "unassigned",
        },
      ];

      return reduce(
        lines,
        function (str, line) {
          var s = "",
            style = defined(line.style) ? line.style : "font-size: 0.8em;";
          if (line.visible !== false) {
            s =
              '<span style="' +
              style +
              '">' +
              (defined(line.title) ? line.title + ": " : "") +
              (defined(line.value) ? line.value : "") +
              "</span><br/>";
          }
          return str + s;
        },
        ""
      );
    },
  },
  title: {
    text: "Intelligent Automation Project Management",
  },
  xAxis: {
    currentDateIndicator: true,
    min: newToday - 5 * day,
    max: newToday + 60 * day,
  },
};

const Chart = () => (
  <div style={{ width: "100%" }}>
    <HighchartsReact highcharts={Highcharts} constructorType={"ganttChart"} options={options} />
  </div>
);

export default Chart;
