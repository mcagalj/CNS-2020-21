define((require) => {
  require("jquery");
  require("jquery.flot");
  require("jquery.flot.time");
  const config = require("config");

  var ChartPoints = { temp: [], hum: [] };

  const label_1 = () =>
    Object.assign({ data: ChartPoints.temp }, config.FLOT_LABELS.label_1);

  const label_2 = () =>
    Object.assign({ data: ChartPoints.hum }, config.FLOT_LABELS.label_2);

  function update(payload) {
    if (!!payload) {
      const { event, data } = payload;
      if (!data || !event) return;

      ["temp", "hum"].forEach((element) => {
        if (!data[element]) return;
        switch (event) {
          case "init":
            ChartPoints[element] = [].concat(
              ChartPoints[element],
              data[element]
            );
            break;

          case "data":
            ChartPoints[element] = [].concat(ChartPoints[element], [
              data[element],
            ]);
            break;
        }
      });
      //   console.log("ChartPoints[temp]:", ChartPoints["temp"]);
      //   console.log("ChartPoints[hum]:", ChartPoints["hum"]);
    }

    $.plot(config.FLOT_CONTAINER, [label_1(), label_2()], config.FLOT_OPTIONS);
  }

  // Make the chart responsive
  $(window).resize(() => update());

  return {
    show: update,
    update: (data) => update(data),
    reset: () => {
      ChartPoints.temp = [];
      ChartPoints.hum = [];
      update();
    },
  };
});
