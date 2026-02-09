const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const upload = require('./src/config/multer');
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/test', upload.single('imagen'), (req, res) => {
    console.log('--- DEBUG SERVER REQUEST ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    res.json({ body: req.body, file: req.file });
});

app.listen(5004, () => console.log('Debug server listening on port 5004'));
