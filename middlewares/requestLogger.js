const requestLogger = (req, res, next) => {

  const method = req.method; 
  const status = res.statusCode;
  const url = req.originalUrl; 
  const timestamp = new Date().toISOString();
  const headers = JSON.stringify(req.headers, null, 2);
  const query = JSON.stringify(req.query, null, 2); 
  const body = JSON.stringify(req.body, null, 2);
  
  
  console.log(`\n[${timestamp}] ${method} request to ${url} request status: ${status}`);
  console.log(`Headers: ${headers}`);
  if (Object.keys(req.query).length > 0) {
    console.log(`Query Parameters: ${query}`);
  }
  if (Object.keys(req.body).length > 0) {
    console.log(`Body: ${body}`);
  }

  next(); 
};
module.exports = requestLogger;
