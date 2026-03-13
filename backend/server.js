const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const publicas = require('./routes/publicas');
const panel    = require('./routes/panel');

app.use('/api',       publicas);
app.use('/api/panel', panel);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 El Rojito corriendo en puerto ${PORT}`));