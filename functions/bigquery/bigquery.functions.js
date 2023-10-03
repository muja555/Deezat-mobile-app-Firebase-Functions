const PROJECT_ID = 'deelzat-76871';
const {BigQuery} = require('@google-cloud/bigquery');

const excuteQuery = (req, res) => {

    const query = req.body.query;

    const bigQuery = new BigQuery({ projectId: PROJECT_ID });
    bigQuery.query({ query }).then(function (results) {

        const rows = results[0]; //get all fetched table rows
        res.send(JSON.stringify(rows))

    }).catch(function (error) {
        res.send(JSON.stringify(error))
    });
}
module.exports = {excuteQuery};
