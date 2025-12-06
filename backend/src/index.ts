import express from 'express'
import cors from 'cors'
import issuerRoutes from './routes/issuer.routes.ts'

const app = express();
app.use(express.json())
app.use(cors({ origin: '*' }));

app.use('/api/issuer', issuerRoutes)



app.listen(3001, () => console.log('Server running on http://localhost:3001'));