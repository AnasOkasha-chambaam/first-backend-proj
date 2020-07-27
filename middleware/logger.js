exports.theLogger = (requ, resp, next) => {
  requ.anyThing = 'Literally any thing';
  console.log('The middleware is running and its variables has been declared.');
  console.log(`${requ.method}  ${requ.protocol}://${requ.get('host')}${requ.originalUrl}`)
  next()
}