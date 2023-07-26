import app from './server'

const port = process.env.APP_PORT

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
