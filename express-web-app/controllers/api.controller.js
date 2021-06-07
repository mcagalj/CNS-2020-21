const config = rootRequire('config');
const ChartPoint = rootRequire('models/chart.points');
const IO = rootRequire('globals').IO;

function emitToOne(username, payload, callback) {
    try {
        IO.clients[username].emit(payload.event, payload.data);
        callback();
    } catch(err) {
        callback(err);
    }
}

function emitToMany(payload, callback) {
    try {
        Object.keys(IO.clients).forEach(username =>
            IO.clients[username].emit(payload.event, payload.data));
        callback();
    } catch(err) {
        callback(err);
    }
}

exports.init = (req, res, next) => {
    ChartPoint.findOne({_id: 'chart'})
        .then(data => {
            if (!data) res.end();
            emitToOne(req.username, {
                event: 'init',
                data: { temp: data.temp, hum: data.hum }
            }, err => err ? next(err) : res.end());
        })  
        .catch(err => {
            err.code = 'EDATABASE';        
            return next(err);
        });

    res.sendStatus(200);
}

exports.add = (req, res, next) => {	
    const timestamp = Date.now() - (new Date()).getTimezoneOffset()*60000;

	// Parse temperature
	let temp = parseFloat(req.body.temp);
	temp = [timestamp, Number.isFinite(temp) ? temp : 0];
    
	// Parse humidity
    let hum = parseFloat(req.body.hum);
	hum = [timestamp, Number.isFinite(hum) ? hum : 0];
 
    ChartPoint.findByIdAndUpdate('chart', 
        { $push: { 'temp': temp, 'hum': hum } }, 
        (err, data) => {
            if (err) {
                err.code = 'EDATABASE';            
                return next(err);
            }

            emitToMany({ 
                event: 'data', 
                data: { temp: temp, hum: hum } 
            }, err => err ? next(err) : res.end());
        });

    res.sendStatus(200);
};

exports.reset = (req, res, next) => {
    ChartPoint.update({_id: 'chart'}, 
        { $set: { temp: [], hum: [] }}, 
        (err, data) => {
            if (err) {
                err.code = 'EDATABASE';
                return next(err);
            }

            emitToMany({ 
                event: 'reset' 
            }, err => err ? next(err) : res.end());
        });

    res.sendStatus(200);
};