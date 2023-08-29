const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://nurulabsarimon:Ar6Ee86fiFg9BlTs@cluster0.d1kr80i.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const database = client.db("BlackcofferDataBase");
        const datas = database.collection("Dashboard");
        app.get(`/datas`, async (req, res) => {
            const result = await datas.find().toArray();
            res.send(result)
        })
        app.get(`/datas/added/:added`, async (req, res) => {
            const addedDate = new Date(req.params.added).getFullYear()
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                new Date(d.added).getFullYear() == addedDate
            )
            )
            if (result.length === 0) {
                res.send('No Data For This Added Date')
            }
            else {
                res.send(result)
            }
        })
        app.get(`/datas/published/:published`, async (req, res) => {
            const publishedDate = new Date(req.params.published).getFullYear()
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                new Date(d.published).getFullYear() == publishedDate
            )
            )
            if (result.length === 0) {
                res.send('No Data For This Publish Date')
            }
            else {
                res.send(result)
            }
        })
        app.get(`/datas/end/:end_year`, async (req, res) => {
            const end_year = req.params.end_year;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                d.end_year == end_year
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }
        })
        app.get(`/datas/start/:start_year`, async (req, res) => {
            const start_year = req.params.start_year;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                d.start_year == start_year
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }
        })
        app.get('/datas/country/:country', async (req, res) => {
            const countryName = req.params.country;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                d.country.toLowerCase() === countryName.toLowerCase()
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }

        })
        app.get('/datas/impact/:impact', async (req, res) => {
            const impact = req.params.impact;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                parseInt(d.impact) === parseInt(impact)
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }

        })
        app.get('/datas/intensity/:intensity', async (req, res) => {
            const intensity = req.params.intensity;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                parseInt(d.intensity) === parseInt(intensity)
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }

        })
        app.get('/datas/intensity/range/:range', async (req, res, next) => {
            const intensity = req.params.range;
            const [lower, upper] = intensity.split('-');
            const data = await datas.find().toArray();
            const resultArray = data.filter(d =>
            (
                parseInt(lower) < parseInt(upper) ? parseInt(d.intensity) >= parseInt(lower) && parseInt(d.intensity) <= parseInt(upper) : parseInt(d.intensity) >= parseInt(upper) && parseInt(d.intensity) <= parseInt(lower)
            )
            )
            const result = resultArray.sort((a, b) => a.intensity - b.intensity)
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }
        })
        // getting the intensity data by range and descending it
        app.get('/datas/intensity/range/:range/descending',async(req,res)=>{
            const intensity = req.params.range;
            const [lower, upper] = intensity.split('-');
            const data = await datas.find().toArray();
            const resultArray = data.filter(d =>
            (
                parseInt(lower) < parseInt(upper) ? parseInt(d.intensity) >= parseInt(lower) && parseInt(d.intensity) <= parseInt(upper) : parseInt(d.intensity) >= parseInt(upper) && parseInt(d.intensity) <= parseInt(lower)
            )
            )
            const result = resultArray.sort((a, b) => b.intensity - a.intensity)
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }
        })
        app.get('/datas/likelihood/:likelihood', async (req, res) => {
            const likelihood = req.params.likelihood;
            const data = await datas.find().toArray();
            const result = data.filter(d =>
            (
                parseInt(d.likelihood) === parseInt(likelihood)
            )
            )
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }

        })
        app.get('/datas/likelihood/range/:range/descending',async(req,res)=>{
            const range = req.params.range;
            const [lower, upper] = range.split('-').map(Number);
            const data = await datas.find().toArray();
            const resultArray = data.filter(d =>
            (
                lower < upper ? d.likelihood >= lower && d.likelihood <= upper : d.likelihood >= parseInt(upper) && parseInt(d.intensity) <= parseInt(lower)
            )
            )
            const result = resultArray.sort((a, b) => b.intensity - a.intensity)
            if (result.length === 0) {
                res.send('No Data For This end year')
            }
            else {
                res.send(result)
            }
        })
        


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running try to cathc data')
})



app.listen(port, () => {
    console.log('express server is running on port: ', port)
})
